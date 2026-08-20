import Foundation

/// Uygulamanın bağımlılıklarının tek noktadan oluşturulmasını sağlayan ortam nesnesi.
///
/// Amaç:
/// - Büyük SQLite veritabanına giden yolu merkezi yönetmek
/// - ViewModel'lere test edilebilir servisler enjekte etmek
/// - Başlangıçta maliyetli kaynakların (DB bağlantısı gibi) tek seferde kurulması
final class AppEnvironment: ObservableObject {
    let databaseManager: DatabaseManager
    let queryConfigLoader: QueryConfigLoader

    private init(databaseManager: DatabaseManager, queryConfigLoader: QueryConfigLoader) {
        self.databaseManager = databaseManager
        self.queryConfigLoader = queryConfigLoader
    }

    static func bootstrap() -> AppEnvironment {
        let databaseURL = DatabasePathResolver.resolveDatabaseURL(fileName: "meri1.sqlite")
        let manager = DatabaseManager(databaseURL: databaseURL)

        let bundle = Bundle.main
        let configURL = bundle.url(forResource: "default-query-configs", withExtension: "json")
        let loader = QueryConfigLoader(configURL: configURL)

        return AppEnvironment(databaseManager: manager, queryConfigLoader: loader)
    }

    func makeSearchViewModel() -> SearchViewModel {
        SearchViewModel(databaseManager: databaseManager, configLoader: queryConfigLoader)
    }
}

enum DatabasePathResolver {
    /// Veritabanı önce Documents altında aranır. Bulunamazsa App Bundle içinde aranır.
    ///
    /// Bu yaklaşım, geliştirici testleri sırasında yazılabilir kopya kullanmayı,
    /// release senaryosunda ise bundle içi sadece-okunur DB dosyasını destekler.
    static func resolveDatabaseURL(fileName: String) -> URL {
        if let documentsURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first {
            let candidate = documentsURL.appendingPathComponent(fileName)
            if FileManager.default.fileExists(atPath: candidate.path) {
                return candidate
            }
        }

        if let bundled = Bundle.main.url(forResource: fileName.replacingOccurrences(of: ".sqlite", with: ""), withExtension: "sqlite") {
            return bundled
        }

        // Dosya henüz yoksa, oluşturma/taşıma akışı için varsayılan Documents hedefi dönülür.
        return (FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first ?? URL(fileURLWithPath: NSTemporaryDirectory()))
            .appendingPathComponent(fileName)
    }
}
