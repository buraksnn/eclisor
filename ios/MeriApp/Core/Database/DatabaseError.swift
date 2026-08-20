import Foundation

enum DatabaseError: LocalizedError {
    case openFailed(path: String, message: String)
    case pragmaFailed(name: String, message: String)
    case prepareFailed(message: String)
    case executionFailed(message: String)
    case missingPrimarySortColumn

    var errorDescription: String? {
        switch self {
        case let .openFailed(path, message):
            return "SQLite açılamadı: \(path). Sebep: \(message)"
        case let .pragmaFailed(name, message):
            return "PRAGMA başarısız: \(name). Sebep: \(message)"
        case let .prepareFailed(message):
            return "Sorgu hazırlanamadı: \(message)"
        case let .executionFailed(message):
            return "Sorgu çalıştırılamadı: \(message)"
        case .missingPrimarySortColumn:
            return "Keyset pagination için en az bir sort column gereklidir."
        }
    }
}
