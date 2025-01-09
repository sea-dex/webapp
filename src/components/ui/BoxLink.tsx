import * as React from "react";
import styles from "./BoxLink.module.css";
import { cn } from "@/lib/utils";

// interface BoxLinkProps extends React.ComponentPropsWithoutRef<"a"> {}
type BoxLinkProps = React.ComponentPropsWithoutRef<"a">

export const BoxLink = React.forwardRef<HTMLAnchorElement, BoxLinkProps>(
	function BoxLink({ className, ...props }, forwardedRef) {
		return (
			<a
				ref={forwardedRef}
				className={cn(styles.BoxLink, className)}
				{...props}
			/>
		);
	},
);
