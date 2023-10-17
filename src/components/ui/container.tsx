import cn from "classnames";
interface Props {
	className?: string;
	children?: any;
	el?: any;
	clean?: boolean;
}

const Container: React.FC<Props> = ({
	children,
	className,
	el = "div",
	clean,
}) => {
	const rootClassName = cn(className, {
		"mx-auto max-w-[1920px] pt-4 ": !clean,
	});

	let Component: any = el as any;

	return <Component className={rootClassName}>{children}</Component>;
};

export default Container;
