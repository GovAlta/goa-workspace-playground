interface DateGroupHeaderProps {
    label: string;
}

export const DateGroupHeader = ({label}: DateGroupHeaderProps) => (
    <h4 style={{
        font: "var(--goa-typography-heading-2xs)",
        color: "var(--goa-color-greyscale-600)",
        paddingLeft: "var(--goa-space-m)",
        marginBottom: 0,
        paddingBottom: "var(--goa-space-s)",
        borderBottom: "1px solid var(--goa-color-greyscale-100)"
    }}>
        {label}
    </h4>
);
