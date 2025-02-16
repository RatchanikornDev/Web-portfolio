
export function validatePositionData(position: Float32Array): Float32Array {
  for (let i = 0; i < position.length; i++) {
    if (isNaN(position[i])) {
      position[i] = 0; // or any default value you prefer
    }
  }
  return position;
}
