import Foundation

@MainActor
final class SearchViewModel: ObservableObject {
    @Published private(set) var configs: [QueryConfig] = []
    @Published private(set) var selectedConfig: QueryConfig?
    @Published private(set) var rows: [[String: SQLiteValue]] = []
    @Published private(set) var metrics: QueryPerformanceSnapshot = .empty
    @Published private(set) var statusText: String = "Hazır"
    @Published var isLoading: Bool = false

    private let databaseManager: DatabaseManager
    private let configLoader: QueryConfigLoader
    private var cursorValue: Int64?

    init(databaseManager: DatabaseManager, configLoader: QueryConfigLoader) {
        self.databaseManager = databaseManager
        self.configLoader = configLoader
    }

    func bootstrap() {
        Task {
            await loadConfigs()
            await fetchFirstPage()
        }
    }

    func select(config: QueryConfig) {
        selectedConfig = config
        cursorValue = nil
        rows = []

        Task {
            await fetchFirstPage()
        }
    }

    func fetchNextPageIfNeeded(currentIndex: Int) {
        guard !isLoading else { return }
        guard currentIndex >= rows.count - 5 else { return }

        Task {
            await fetchNextPage()
        }
    }

    private func loadConfigs() async {
        statusText = "Konfigürasyon yükleniyor..."

        do {
            let loaded = try configLoader.load()
            configs = loaded
            selectedConfig = loaded.first
            statusText = "Konfigürasyon hazır"
        } catch {
            statusText = error.localizedDescription
        }
    }

    private func fetchFirstPage() async {
        cursorValue = nil
        rows.removeAll(keepingCapacity: true)
        await fetchNextPage()
    }

    private func fetchNextPage() async {
        guard let config = selectedConfig else { return }

        isLoading = true
        statusText = "Dizin taranıyor..."

        do {
            statusText = "Eşleşmeler filtreleniyor..."
            let result = try await databaseManager.fetchPage(using: config, cursorValue: cursorValue, limit: config.pageSize)
            cursorValue = result.nextCursorValue
            rows.append(contentsOf: result.rows)
            metrics = result.metrics
            statusText = "Tamamlandı"
        } catch {
            statusText = error.localizedDescription
        }

        isLoading = false
    }
}
