import { useState } from "react";

const useHover = () => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return { isHovered, handleMouseEnter, handleMouseLeave };
}

export default useHover