"use client";

import { useAdjusterDetail } from "../_api/use-adjuster-detail";
import { AdjusterCareers } from "./AdjusterCareers";
import { AdjusterIntro } from "./AdjusterIntro";
import { AdjusterProfileHeader } from "./AdjusterProfileHeader";
import { AdjusterReviews } from "./AdjusterReviews";
import { AdjusterSpecialties } from "./AdjusterSpecialties";
import { CertificationCard } from "./CertificationCard";
import { ConsultGuideCard } from "./ConsultGuideCard";

export function AdjusterProfileView({ adjusterId }: { adjusterId: string }) {
  const { data } = useAdjusterDetail(adjusterId);

  return (
    <div>
      <AdjusterProfileHeader
        nickname={data.nickname}
        avatarUrl={data.avatarUrl}
        career={data.career}
        specialties={data.specialties}
        verified={data.verified}
        averageRating={data.averageRating}
        reviewCount={data.reviewCount}
        completedConsultCount={data.completedConsultCount}
        handledCaseCount={data.handledCaseCount}
      />

      <div className="mx-auto grid w-full max-w-[1100px] items-start gap-6 px-4 py-9 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <AdjusterIntro introduction={data.introduction} />
          <AdjusterSpecialties specialties={data.specialties} />
          <AdjusterCareers careers={data.careers} />
          <AdjusterReviews
            reviews={data.recentReviews}
            averageRating={data.averageRating}
            reviewCount={data.reviewCount}
          />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <ConsultGuideCard adjusterId={adjusterId} consultGuide={data.consultGuide} />
          <CertificationCard
            certification={data.certification}
            activityRegion={data.activityRegion}
            verified={data.verified}
          />
        </aside>
      </div>
    </div>
  );
}
