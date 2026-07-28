import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { formatManwon, formatManwonRange } from "@/shared/lib/format-amount";
import { REPORT_TITLE } from "../_model/report-meta";
import type { ReportDetail } from "../_model/types";

Font.register({
  family: "Gowun",
  fonts: [
    { src: "/fonts/GowunBatang-Regular.ttf" },
    { src: "/fonts/GowunBatang-Bold.ttf", fontWeight: "bold" },
  ],
});

const INK = "#15202e";
const INK3 = "#7b8693";
const LINE = "#e6e0d4";
const NAVY = "#182740";
const GOLD = "#8a6420";

const ISSUE_LABEL: Record<string, string> = {
  CONFIRMED: "확정",
  TRUSTED: "신뢰",
  INFO: "안내",
};

const won = (n: number) => `${formatManwon(n)}만원`;
const range = formatManwonRange;

const s = StyleSheet.create({
  page: { fontFamily: "Gowun", fontSize: 10, color: INK, padding: 36, lineHeight: 1.5 },
  title: { fontSize: 20, fontWeight: "bold" },
  crumb: { fontSize: 9, color: INK3, marginTop: 4 },
  section: { marginTop: 16, borderWidth: 1, borderColor: LINE, borderRadius: 8, padding: 14 },
  h2: { fontSize: 12, fontWeight: "bold", marginBottom: 6 },
  navyCard: { marginTop: 16, backgroundColor: NAVY, borderRadius: 8, padding: 16, color: "#fff" },
  navyLabel: { fontSize: 10, fontWeight: "bold", color: "#fff" },
  navyAmount: { fontSize: 22, fontWeight: "bold", color: "#fff", marginTop: 8 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  issue: { borderTopWidth: 1, borderColor: LINE, paddingTop: 8, marginTop: 8 },
  issueHead: { flexDirection: "row", justifyContent: "space-between" },
  issueTitle: { fontSize: 11, fontWeight: "bold" },
  badge: { fontSize: 9, color: GOLD, fontWeight: "bold" },
  tag: { fontSize: 9, color: INK3, marginTop: 3 },
  li: { marginTop: 2 },
  muted: { color: INK3, fontSize: 9 },
});

export function ReportPdfDocument({ report }: { report: ReportDetail }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.crumb}>
          {report.accidentType ?? ""} · {report.treatment} · 검수 의견 {report.issues.length}건
        </Text>
        <Text style={s.title}>{REPORT_TITLE}</Text>

        {(report.adjuster?.nickname || report.reviewComment) && (
          <View style={s.section}>
            <Text style={s.h2}>
              {report.adjuster?.nickname
                ? `${report.adjuster.nickname} 손해사정사의 검수 의견`
                : "검수 의견"}
            </Text>
            {report.reviewComment && <Text>{`“${report.reviewComment}”`}</Text>}
            <Text style={[s.muted, { marginTop: 4 }]}>
              {[
                report.adjuster?.career != null ? `${report.adjuster.career}년차` : null,
                report.reviewedAt && `${report.reviewedAt} 검수`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </Text>
          </View>
        )}

        <View style={s.navyCard}>
          <Text style={s.navyLabel}>검토 보장</Text>
          <Text style={s.navyAmount}>
            {report.claimedMinAmount != null && report.claimedMaxAmount != null
              ? range(report.claimedMinAmount, report.claimedMaxAmount)
              : "미산정"}
          </Text>
          {report.offeredAmount != null && (
            <Text style={{ color: "#fff", fontSize: 10, marginTop: 8 }}>
              보험사 제안 금액: {won(report.offeredAmount)}
            </Text>
          )}
        </View>

        {report.issues.length > 0 && (
          <View style={s.section}>
            <Text style={s.h2}>검토 의견 및 보완 사항</Text>
            {report.issues.map((it, i) => (
              <View key={i} style={i === 0 ? undefined : s.issue}>
                <View style={s.issueHead}>
                  <Text style={s.issueTitle}>
                    {i + 1}. {it.title}
                  </Text>
                  <Text style={s.badge}>{ISSUE_LABEL[it.aiStatus] ?? "안내"}</Text>
                </View>
                <Text style={{ marginTop: 2 }}>{it.description}</Text>
                {it.tags?.[0] && <Text style={s.tag}>{it.tags[0]}</Text>}
              </View>
            ))}
          </View>
        )}

        {report.applicableGuarantees.length > 0 && (
          <View style={s.section}>
            <Text style={s.h2}>적용 가능 보장 {report.applicableGuarantees.length}건</Text>
            {report.applicableGuarantees.map((g, i) => (
              <Text key={i} style={s.li}>
                ✓ {g}
              </Text>
            ))}
          </View>
        )}

        {report.omittedSpecialContract.length > 0 && (
          <View style={s.section}>
            <Text style={s.h2}>누락 가능 특약 {report.omittedSpecialContract.length}건</Text>
            {report.omittedSpecialContract.map((c, i) => (
              <Text key={i} style={s.li}>
                ! {c}
              </Text>
            ))}
          </View>
        )}

        {report.basisTermsPrecedents.length > 0 && (
          <View style={s.section}>
            <Text style={s.h2}>근거 약관·판례</Text>
            {report.basisTermsPrecedents.map((b, i) => (
              <Text key={i} style={[s.li, s.muted]}>
                ※ {b}
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
