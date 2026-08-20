import Foundation
import SQLite3

/// 20GB+ SQLite dosyalarında düşük RAM kullanımı ve akıcı UI için actor tabanlı yönetici.
///
/// Mimari notlar:
/// - Actor izolasyonu ile tek bağlantı üzerinde thread-safe erişim sağlar.
/// - PRAGMA ayarları A18/8GB senaryosunda I/O ve bellek dengesine odaklanır.
/// - Keyset pagination ile OFFSET maliyetini önleyerek büyük tablolarda stabil performans sunar.
actor DatabaseManager {
    typealias SQLiteConnection = OpaquePointer

    private let databaseURL: URL
    private var connection: SQLiteConnection?

    init(databaseURL: URL) {
        self.databaseURL = databaseURL
    }

    deinit {
        if let connection {
            sqlite3_close_v2(connection)
        }
    }

    /// Bağlantıyı açar ve performans odaklı PRAGMA'ları uygular.
    func openIfNeeded() throws {
        if connection != nil { return }

        var db: SQLiteConnection?
        let flags = SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE | SQLITE_OPEN_NOMUTEX

        if sqlite3_open_v2(databaseURL.path, &db, flags, nil) != SQLITE_OK {
            let message = String(cString: sqlite3_errmsg(db))
            throw DatabaseError.openFailed(path: databaseURL.path, message: message)
        }

        guard let db else {
            throw DatabaseError.openFailed(path: databaseURL.path, message: "Unknown connection error")
        }

        connection = db
        try configurePragmas()
    }

    /// WAL + mmap + cache ayarlarıyla büyük dosya erişimini optimize eder.
    private func configurePragmas() throws {
        let pragmas: [String] = [
            "PRAGMA journal_mode=WAL;",
            "PRAGMA synchronous=NORMAL;",
            "PRAGMA temp_store=MEMORY;",
            "PRAGMA cache_size=-16384;",      // ~16MB page cache
            "PRAGMA mmap_size=268435456;",    // 256MB memory-map
            "PRAGMA foreign_keys=ON;"
        ]

        for pragma in pragmas {
            try execute(statement: pragma, pragmaName: pragma)
        }
    }

    /// Keyset pagination ile satırları stream eder.
    ///
    /// - Parameters:
    ///   - config: Dinamik sorgu şablonu ve kolon tanımları
    ///   - cursorValue: Son görülen birincil sıralama değeri
    ///   - limit: Sayfa boyutu
    /// - Returns: Sonuç satırları ve yeni cursor değeri
    func fetchPage(
        using config: QueryConfig,
        cursorValue: Int64?,
        limit: Int
    ) async throws -> PaginatedQueryResult {
        try openIfNeeded()
        guard let db = connection else {
            throw DatabaseError.openFailed(path: databaseURL.path, message: "Connection unavailable")
        }

        guard let primarySort = config.sortColumns.first else {
            throw DatabaseError.missingPrimarySortColumn
        }

        let start = ContinuousClock.now

        let whereClause: String
        if let cursorValue {
            whereClause = config.baseFilter.map { "\($0) AND \(primarySort.name) > ?" } ?? "\(primarySort.name) > ?"
        } else {
            whereClause = config.baseFilter ?? "1=1"
        }

        let selectedColumns = config.selectColumns.joined(separator: ", ")
        let order = config.sortColumns
            .map { "\($0.name) \($0.direction.rawValue)" }
            .joined(separator: ", ")

        let sql = """
        SELECT \(selectedColumns)
        FROM \(config.tableName)
        WHERE \(whereClause)
        ORDER BY \(order)
        LIMIT ?;
        """

        var statement: OpaquePointer?
        if sqlite3_prepare_v2(db, sql, -1, &statement, nil) != SQLITE_OK {
            throw DatabaseError.prepareFailed(message: String(cString: sqlite3_errmsg(db)))
        }
        defer { sqlite3_finalize(statement) }

        var bindIndex: Int32 = 1
        if let cursorValue {
            sqlite3_bind_int64(statement, bindIndex, cursorValue)
            bindIndex += 1
        }
        sqlite3_bind_int(statement, bindIndex, Int32(limit))

        var rows: [[String: SQLiteValue]] = []
        rows.reserveCapacity(limit)

        var lastCursor: Int64?

        while sqlite3_step(statement) == SQLITE_ROW {
            var row: [String: SQLiteValue] = [:]

            for index in 0..<sqlite3_column_count(statement) {
                let columnName = String(cString: sqlite3_column_name(statement, index))
                row[columnName] = SQLiteValue.extract(from: statement, column: index)
            }

            if let cursor = row[primarySort.name]?.int64Value {
                lastCursor = cursor
            }
            rows.append(row)
        }

        let elapsed = start.duration
        let durationMs = Double(elapsed.components.seconds) * 1_000 + Double(elapsed.components.attoseconds) / 1_000_000_000_000_000

        return PaginatedQueryResult(
            rows: rows,
            nextCursorValue: lastCursor,
            metrics: QueryPerformanceSnapshot(
                durationMilliseconds: durationMs,
                returnedRowCount: rows.count,
                totalMatchedCount: nil,
                memoryFootprintMB: nil,
                cpuLoadPercent: nil
            )
        )
    }

    private func execute(statement: String, pragmaName: String) throws {
        guard let db = connection else {
            throw DatabaseError.openFailed(path: databaseURL.path, message: "Connection unavailable")
        }

        if sqlite3_exec(db, statement, nil, nil, nil) != SQLITE_OK {
            throw DatabaseError.pragmaFailed(
                name: pragmaName,
                message: String(cString: sqlite3_errmsg(db))
            )
        }
    }
}

struct PaginatedQueryResult: Sendable {
    let rows: [[String: SQLiteValue]]
    let nextCursorValue: Int64?
    let metrics: QueryPerformanceSnapshot
}

enum SQLiteValue: Sendable {
    case integer(Int64)
    case real(Double)
    case text(String)
    case blob(Data)
    case null

    var int64Value: Int64? {
        if case let .integer(value) = self { return value }
        return nil
    }

    static func extract(from statement: OpaquePointer?, column: Int32) -> SQLiteValue {
        switch sqlite3_column_type(statement, column) {
        case SQLITE_INTEGER:
            return .integer(sqlite3_column_int64(statement, column))
        case SQLITE_FLOAT:
            return .real(sqlite3_column_double(statement, column))
        case SQLITE_TEXT:
            guard let raw = sqlite3_column_text(statement, column) else { return .null }
            return .text(String(cString: raw))
        case SQLITE_BLOB:
            let length = Int(sqlite3_column_bytes(statement, column))
            guard let bytes = sqlite3_column_blob(statement, column) else { return .null }
            return .blob(Data(bytes: bytes, count: length))
        default:
            return .null
        }
    }
}
