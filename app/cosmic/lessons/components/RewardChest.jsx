"use client";

import BaseRewardChest from "../../../../components/cosmic/RewardChest";
export default function RewardChest({ ayah }) { return <BaseRewardChest id={`lesson-surah-${ayah.id}`} reward={25} label="Surah mastery reward" />; }
