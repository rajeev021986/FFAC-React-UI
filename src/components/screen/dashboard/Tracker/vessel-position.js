export function getVesselDirectionAndPosition(vesselData) {
    const { navigational_heading_degrees } = vesselData;

    let direction;
    if (navigational_heading_degrees >= 0 && navigational_heading_degrees <= 180) {
        direction = "mright"; // Heading from North to East to South
    } else {
        direction = "mleft";  // Heading from South to West to North
    }

    return {
        direction,
    };
}