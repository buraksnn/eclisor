import Foundation

/// QueryConfig JSON dosyasını yükleyip doğrulayan servis.
struct QueryConfigLoader {
    let configURL: URL?

    func load() throws -> [QueryConfig] {
        guard let configURL else {
            throw QueryConfigError.configFileNotFound
        }

        let data = try Data(contentsOf: configURL)
        let decoder = JSONDecoder()
        let payload = try decoder.decode(QueryConfigCollection.self, from: data)

        guard !payload.categories.isEmpty else {
            throw QueryConfigError.emptyConfig
        }

        return payload.categories
    }
}

enum QueryConfigError: LocalizedError {
    case configFileNotFound
    case emptyConfig

    var errorDescription: String? {
        switch self {
        case .configFileNotFound:
            return "Query config dosyası bulunamadı."
        case .emptyConfig:
            return "En az bir query config tanımı gereklidir."
        }
    }
}
