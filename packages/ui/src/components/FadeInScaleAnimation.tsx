import clsx from "clsx";
import React, { ReactNode } from "react";
import "../styles/animations.scss";

type AnimationDuration =
  | "0.1"
  | "0.2"
  | "0.3"
  | "0.4"
  | "0.5"
  | "0.75"
  | "0.8"
  | "0.9"
  | "1"
  | "1.1"
  | "1.2"
  | "1.3"
  | "1.4"
  | "1.5"
  | "1.75"
  | "2";

const animationClassNamesMap: Readonly<Record<AnimationDuration, string>> = {
  "0.1": "_0_1_fade_in_scale_in",
  "0.2": "_0_2_fade_in_scale_in",
  "0.3": "_0_3_fade_in_scale_in",
  "0.4": "_0_4_fade_in_scale_in",
  "0.5": "_0_5_fade_in_scale_in",
  "0.75": "_0_75_fade_in_scale_in",
  "0.8": "_0_8_fade_in_scale_in",
  "0.9": "_0_9_fade_in_scale_in",
  "1": "_1_fade_in_scale_in",
  "1.1": "_1_1_fade_in_scale_in",
  "1.2": "_1_2_fade_in_scale_in",
  "1.3": "_1_3_fade_in_scale_in",
  "1.4": "_1_4_fade_in_scale_in",
  "1.5": "_1_5_fade_in_scale_in",
  "1.75": "_1_75_fade_in_scale_in",
  "2": "_2_fade_in_scale_in",
} as const;

/**
 * A component that fades in and scales in its children.
 *
 * @param duration The duration of the animation.
 * @param children The children to animate.
 * @param className An optional class name to add to the component.
 * @returns The animated component.
 */
export const FadeInScaleAnimation: React.FunctionComponent<
  Readonly<{
    duration: AnimationDuration;
    children: ReactNode;
    className?: string;
  }>
> = ({ duration, children, className }) => {
  return (
    <div className={clsx(animationClassNamesMap[duration], className)}>
      {children}
    </div>
  );
};
