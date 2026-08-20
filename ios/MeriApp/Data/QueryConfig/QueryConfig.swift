import Foundation

/// JSON ile taşınabilen dinamik sorgu tanımı.
///
/// Bu yapı sayesinde yeni kategori/sayfa eklerken kod yerine sadece config güncellenebilir.
struct QueryConfig: Codable, Identifiable, Sendable {
    let id: String
    let title: String
    let tableName: String
    let selectColumns: [String]
    let baseFilter: String?
    let sortColumns: [SortColumn]
    let pageSize: Int
    let searchableColumns: [String]
}

struct SortColumn: Codable, Sendable {
    let name: String
    let direction: SortDirection
}

enum SortDirection: String, Codable, Sendable {
    case ascending = "ASC"
    case descending = "DESC"
}

struct QueryConfigCollection: Codable, Sendable {
    let categories: [QueryConfig]
}
