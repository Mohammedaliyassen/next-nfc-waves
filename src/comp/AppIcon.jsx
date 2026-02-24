import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

function Icon({
    name,
    size = 24,
    color = "currentColor",
    className = "",
    strokeWidth = 2,
    ...props
}) {
    // التأكد من أننا نأخذ المكون الصحيح من الكائن
    const IconComponent = LucideIcons[name];

    // التحقق: هل ما حصلنا عليه هو فعلاً مكون صالح؟
    if (!IconComponent || typeof IconComponent !== 'function' && typeof IconComponent !== 'object') {
        console.warn(`Icon "${name}" not found in lucide-react`);
        return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
    }

    return (
        <IconComponent
            size={size}
            color={color}
            strokeWidth={strokeWidth}
            className={className}
            {...props}
        />
    );
}

export default Icon;