import Foundation

/// UI'da gösterilecek temel performans metriklerini taşır.
struct QueryPerformanceSnapshot: Sendable {
    let durationMilliseconds: Double
    let returnedRowCount: Int
    let totalMatchedCount: Int?
    let memoryFootprintMB: Double?
    let cpuLoadPercent: Double?

    static let empty = QueryPerformanceSnapshot(
        durationMilliseconds: 0,
        returnedRowCount: 0,
        totalMatchedCount: nil,
        memoryFootprintMB: nil,
        cpuLoadPercent: nil
    )
}
