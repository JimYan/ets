import Phaser from "phaser";

const createPoisonAnims = (
  targets: Phaser.GameObjects.Sprite,
  x: number,
  y: number,
  filpX = true
) => {
  return {
    targets,
    x: filpX
      ? x + Phaser.Math.Between(20, 100)
      : x - Phaser.Math.Between(20, 100),
    y: y - Phaser.Math.Between(20, 100),
    alpha: 0,
    ease: "power1",
    scaleX: 0.2,
    scaleY: 0.2,
    duration: 2000,
    onComplete: () => {
      targets.destroy();
    },
  };
};

export { createPoisonAnims };
