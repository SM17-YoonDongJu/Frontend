"use client";

import { useRef } from "react";
import { useAdjusterDetail } from "../_api/use-adjuster-detail";
import { AdjusterCareers } from "./AdjusterCareers";
import { AdjusterIntro } from "./AdjusterIntro";
import { AdjusterProfileHeader } from "./AdjusterProfileHeader";
import { AdjusterReviews } from "./AdjusterReviews";
import { AdjusterSpecialties } from "./AdjusterSpecialties";
import { CertificationCard } from "./CertificationCard";
import { ConsultGuideCard } from "./ConsultGuideCard";
import { MobileAppBar } from "./MobileAppBar";
import { MobileMetricStrip } from "./MobileMetricStrip";
import { MobileStickyCta } from "./MobileStickyCta";

export function AdjusterProfileView({ adjusterId }: { adjusterId: string }) {
  const { data } = useAdjusterDetail(adjusterId);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <MobileAppBar />
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
      <MobileMetricStrip
        averageRating={data.averageRating}
        completedConsultCount={data.completedConsultCount}
        onRatingClick={scrollToReviews}
      />

      <div className="mx-auto grid w-full max-w-[68.75rem] items-start gap-5 px-5 pb-28 pt-5 lg:grid-cols-[1fr_21.25rem] lg:gap-6 lg:px-4 lg:py-9">
        <div className="space-y-5 lg:space-y-6">
          <AdjusterIntro introduction={data.introduction} />
          <AdjusterSpecialties specialties={data.specialties} />
          <AdjusterCareers careers={data.careers} />
          <div ref={reviewsRef} className="scroll-mt-14 lg:scroll-mt-6">
            <AdjusterReviews
              reviews={data.recentReviews}
              averageRating={data.averageRating}
              reviewCount={data.reviewCount}
            />
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6 lg:space-y-6 lg:self-start">
          <ConsultGuideCard adjusterId={adjusterId} consultGuide={data.consultGuide} />
          <CertificationCard
            certification={data.certification}
            activityRegion={data.activityRegion}
            verified={data.verified}
          />
        </aside>
      </div>

      <MobileStickyCta adjusterId={adjusterId} />
    </div>
  );
}
