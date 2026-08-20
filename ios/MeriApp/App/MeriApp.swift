import SwiftUI

@main
struct MeriApp: App {
    @StateObject private var environment = AppEnvironment.bootstrap()

    var body: some Scene {
        WindowGroup {
            SearchView(viewModel: environment.makeSearchViewModel())
        }
    }
}
