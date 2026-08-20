import SwiftUI

struct SearchView: View {
    @ObservedObject var viewModel: SearchViewModel

    var body: some View {
        NavigationStack {
            ZStack {
                LinearGradient(
                    colors: [Color.blue.opacity(0.35), Color.indigo.opacity(0.15), Color.black.opacity(0.2)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()

                VStack(spacing: 12) {
                    picker
                    statusCard
                    resultsList
                }
                .padding()
            }
            .navigationTitle("Meri Explorer")
        }
        .task {
            viewModel.bootstrap()
        }
    }

    private var picker: some View {
        Picker("Kategori", selection: Binding(get: {
            viewModel.selectedConfig?.id ?? ""
        }, set: { newValue in
            guard let config = viewModel.configs.first(where: { $0.id == newValue }) else { return }
            viewModel.select(config: config)
        })) {
            ForEach(viewModel.configs) { config in
                Text(config.title).tag(config.id)
            }
        }
        .pickerStyle(.segmented)
        .padding(10)
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    }

    private var statusCard: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(viewModel.statusText)
                .font(.headline)
            Text("Sorgu: \(viewModel.metrics.durationMilliseconds, specifier: "%.2f") ms")
                .font(.caption)
            Text("Listelenen: \(viewModel.rows.count)")
                .font(.caption)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(.thinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    }

    private var resultsList: some View {
        List(Array(viewModel.rows.enumerated()), id: \.offset) { index, row in
            VStack(alignment: .leading, spacing: 4) {
                ForEach(row.keys.sorted(), id: \.self) { key in
                    Text("\(key): \(row[key].map(describe) ?? "")")
                        .font(.caption)
                        .lineLimit(1)
                }
            }
            .onAppear {
                viewModel.fetchNextPageIfNeeded(currentIndex: index)
            }
        }
        .scrollContentBackground(.hidden)
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
    }

    private func describe(_ value: SQLiteValue) -> String {
        switch value {
        case let .integer(v): return String(v)
        case let .real(v): return String(format: "%.4f", v)
        case let .text(v): return v
        case let .blob(data): return "Blob(\(data.count) bytes)"
        case .null: return "NULL"
        }
    }
}
