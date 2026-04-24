const canvas = document.getElementById("previewCanvas");
const ctx = canvas.getContext("2d");
const fabricStatus = document.getElementById("fabricStatus");
const modelStatus = document.getElementById("modelStatus");

const MODEL_SOURCE = "./model.jpg";

const HAT_POLYGON = [
  { x: 694, y: 108 },
  { x: 663, y: 171 },
  { x: 626, y: 259 },
  { x: 587, y: 356 },
  { x: 551, y: 448 },
  { x: 523, y: 546 },
  { x: 703, y: 566 },
  { x: 879, y: 546 },
  { x: 850, y: 448 },
  { x: 815, y: 356 },
  { x: 776, y: 259 },
  { x: 739, y: 171 },
];

const HAT_BOUNDS = {
  minX: 523,
  minY: 108,
  maxX: 879,
  maxY: 566,
  centerX: 701,
  centerY: 337,
};

const RIBBON_PARTS = {
  leftWing: [
    { x: 688, y: 1118 },
    { x: 618, y: 1086 },
    { x: 510, y: 1098 },
    { x: 430, y: 1140 },
    { x: 454, y: 1202 },
    { x: 544, y: 1232 },
    { x: 626, y: 1222 },
    { x: 666, y: 1186 },
    { x: 610, y: 1162 },
    { x: 676, y: 1140 },
    { x: 712, y: 1160 },
  ],
  rightWing: [
    { x: 720, y: 1118 },
    { x: 790, y: 1086 },
    { x: 892, y: 1098 },
    { x: 970, y: 1142 },
    { x: 946, y: 1202 },
    { x: 858, y: 1230 },
    { x: 774, y: 1220 },
    { x: 734, y: 1184 },
    { x: 788, y: 1162 },
    { x: 724, y: 1140 },
    { x: 696, y: 1158 },
  ],
  knot: [
    { x: 660, y: 1114 },
    { x: 704, y: 1102 },
    { x: 746, y: 1112 },
    { x: 764, y: 1148 },
    { x: 748, y: 1182 },
    { x: 708, y: 1196 },
    { x: 668, y: 1184 },
    { x: 644, y: 1150 },
  ],
  leftTail: [
    { x: 682, y: 1188 },
    { x: 726, y: 1208 },
    { x: 720, y: 1456 },
    { x: 668, y: 1462 },
    { x: 650, y: 1218 },
  ],
  rightTail: [
    { x: 716, y: 1204 },
    { x: 764, y: 1186 },
    { x: 814, y: 1450 },
    { x: 760, y: 1460 },
    { x: 730, y: 1220 },
  ],
};

const RIBBON_BOUNDS = {
  minX: 430,
  minY: 1088,
  maxX: 970,
  maxY: 1462,
  centerX: 700,
  centerY: 1246,
};

const POMPOM_CENTER = { x: 700, y: 83 };
const TEXT_ANCHOR = { x: 700, y: 265 };
const LOGO_ANCHOR = { x: 700, y: 265 };
const FABRIC_REFERENCE = {
  width: HAT_BOUNDS.maxX - HAT_BOUNDS.minX,
  height: HAT_BOUNDS.maxY - HAT_BOUNDS.minY,
  centerX: HAT_BOUNDS.centerX,
  centerY: HAT_BOUNDS.centerY,
};

const RIBBON_REFERENCE = {
  width: RIBBON_BOUNDS.maxX - RIBBON_BOUNDS.minX,
  height: RIBBON_BOUNDS.maxY - RIBBON_BOUNDS.minY,
  centerX: RIBBON_BOUNDS.centerX,
  centerY: RIBBON_BOUNDS.centerY,
};

const state = {
  model: {
    image: null,
  },
  fabric: {
    image: null,
    name: "",
    scale: 100,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    repeat: true,
  },
  pompom: {
    visible: true,
    color: "#c71c2f",
    size: 56,
  },
  text: {
    value: "",
    color: "#d43e36",
    size: 56,
    fontPreset: "basic",
    offsetX: 0,
    offsetY: 0,
  },
  logo: {
    image: null,
    name: "",
    scale: 90,
    offsetX: 0,
    offsetY: 0,
  },
};

const controls = {
  fabricUpload: document.getElementById("fabricUpload"),
  resetFabricBtn: document.getElementById("resetFabricBtn"),
  fabricScale: document.getElementById("fabricScale"),
  fabricOffsetX: document.getElementById("fabricOffsetX"),
  fabricOffsetY: document.getElementById("fabricOffsetY"),
  fabricRotation: document.getElementById("fabricRotation"),
  patternRepeat: document.getElementById("patternRepeat"),
  showPompom: document.getElementById("showPompom"),
  pompomColor: document.getElementById("pompomColor"),
  pompomSize: document.getElementById("pompomSize"),
  logoText: document.getElementById("logoText"),
  textFont: document.getElementById("textFont"),
  textColor: document.getElementById("textColor"),
  textSize: document.getElementById("textSize"),
  textOffsetX: document.getElementById("textOffsetX"),
  textOffsetY: document.getElementById("textOffsetY"),
  logoUpload: document.getElementById("logoUpload"),
  logoScale: document.getElementById("logoScale"),
  logoOffsetX: document.getElementById("logoOffsetX"),
  logoOffsetY: document.getElementById("logoOffsetY"),
  clearLogoBtn: document.getElementById("clearLogoBtn"),
  downloadBtn: document.getElementById("downloadBtn"),
  downloadTransparentBtn: document.getElementById("downloadTransparentBtn"),
};

const valueLabels = {
  fabricScale: document.getElementById("fabricScaleValue"),
  fabricOffsetX: document.getElementById("fabricOffsetXValue"),
  fabricOffsetY: document.getElementById("fabricOffsetYValue"),
  fabricRotation: document.getElementById("fabricRotationValue"),
  pompomColor: document.getElementById("pompomColorValue"),
  pompomSize: document.getElementById("pompomSizeValue"),
  textColor: document.getElementById("textColorValue"),
  textSize: document.getElementById("textSizeValue"),
  textOffsetX: document.getElementById("textOffsetXValue"),
  textOffsetY: document.getElementById("textOffsetYValue"),
  logoScale: document.getElementById("logoScaleValue"),
  logoOffsetX: document.getElementById("logoOffsetXValue"),
  logoOffsetY: document.getElementById("logoOffsetYValue"),
};

function buildHatPath(targetContext) {
  buildPolygonPath(targetContext, HAT_POLYGON);
}

function buildRibbonPath(targetContext) {
  targetContext.beginPath();
  Object.values(RIBBON_PARTS).forEach((polygon) => {
    targetContext.moveTo(polygon[0].x, polygon[0].y);
    for (let i = 1; i < polygon.length; i += 1) {
      targetContext.lineTo(polygon[i].x, polygon[i].y);
    }
    targetContext.closePath();
  });
}

function buildPolygonPath(targetContext, polygon) {
  targetContext.beginPath();
  targetContext.moveTo(polygon[0].x, polygon[0].y);
  for (let i = 1; i < polygon.length; i += 1) {
    targetContext.lineTo(polygon[i].x, polygon[i].y);
  }
  targetContext.closePath();
}

function drawPlaceholderFabric(targetContext, referenceBox) {
  const gradient = targetContext.createLinearGradient(
    referenceBox.centerX - referenceBox.width * 0.5,
    referenceBox.centerY - referenceBox.height * 0.5,
    referenceBox.centerX + referenceBox.width * 0.5,
    referenceBox.centerY + referenceBox.height * 0.5
  );
  gradient.addColorStop(0, "#f8f2ec");
  gradient.addColorStop(0.5, "#e4d7c9");
  gradient.addColorStop(1, "#cdb8a3");
  targetContext.fillStyle = gradient;
  targetContext.fillRect(
    referenceBox.centerX - referenceBox.width * 1.2,
    referenceBox.centerY - referenceBox.height * 1.4,
    referenceBox.width * 2.4,
    referenceBox.height * 2.8
  );

  targetContext.strokeStyle = "rgba(70, 70, 70, 0.38)";
  targetContext.lineWidth = 16;
  for (let x = referenceBox.centerX - referenceBox.width * 1.2; x < referenceBox.centerX + referenceBox.width * 1.2; x += 44) {
    targetContext.beginPath();
    targetContext.moveTo(x, referenceBox.centerY - referenceBox.height * 1.45);
    targetContext.lineTo(x + 26, referenceBox.centerY + referenceBox.height * 1.35);
    targetContext.stroke();
  }
}

function drawFabricFill(targetContext, pathBuilder, referenceBox) {
  const fabricImage = state.fabric.image;
  const patternBox = {
    width: referenceBox.width,
    height: referenceBox.height,
    centerX: referenceBox.centerX + state.fabric.offsetX,
    centerY: referenceBox.centerY + state.fabric.offsetY,
  };
  const rotation = (state.fabric.rotation * Math.PI) / 180;

  targetContext.save();
  pathBuilder(targetContext);
  targetContext.clip();
  targetContext.translate(patternBox.centerX, patternBox.centerY);
  targetContext.rotate(rotation);

  if (!fabricImage) {
    targetContext.translate(-patternBox.centerX, -patternBox.centerY);
    drawPlaceholderFabric(targetContext, referenceBox);
    targetContext.restore();
    return;
  }

  const fitScale = Math.max(
    patternBox.width / fabricImage.width,
    patternBox.height / fabricImage.height
  );
  const imageScale = fitScale * (state.fabric.scale / 100);
  const drawWidth = fabricImage.width * imageScale;
  const drawHeight = fabricImage.height * imageScale;

  if (state.fabric.repeat) {
    const cols = Math.ceil((patternBox.width * 2.8) / drawWidth) + 2;
    const rows = Math.ceil((patternBox.height * 2.8) / drawHeight) + 2;
    const startX = -((cols / 2) * drawWidth);
    const startY = -((rows / 2) * drawHeight);

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        targetContext.drawImage(
          fabricImage,
          startX + col * drawWidth,
          startY + row * drawHeight,
          drawWidth,
          drawHeight
        );
      }
    }
  } else {
    targetContext.drawImage(
      fabricImage,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );
  }

  targetContext.restore();
}

function drawHatTexture(targetContext) {
  targetContext.save();
  buildHatPath(targetContext);
  targetContext.clip();

  const leftShadow = targetContext.createLinearGradient(HAT_BOUNDS.minX, 0, HAT_BOUNDS.centerX, 0);
  leftShadow.addColorStop(0, "rgba(0, 0, 0, 0.26)");
  leftShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  targetContext.fillStyle = leftShadow;
  targetContext.fillRect(HAT_BOUNDS.minX - 10, HAT_BOUNDS.minY, 230, HAT_BOUNDS.maxY - HAT_BOUNDS.minY);

  const rightShadow = targetContext.createLinearGradient(HAT_BOUNDS.maxX, 0, HAT_BOUNDS.centerX, 0);
  rightShadow.addColorStop(0, "rgba(0, 0, 0, 0.24)");
  rightShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  targetContext.fillStyle = rightShadow;
  targetContext.fillRect(HAT_BOUNDS.centerX, HAT_BOUNDS.minY, 220, HAT_BOUNDS.maxY - HAT_BOUNDS.minY);

  const topHighlight = targetContext.createRadialGradient(
    HAT_BOUNDS.centerX,
    HAT_BOUNDS.minY + 110,
    10,
    HAT_BOUNDS.centerX,
    HAT_BOUNDS.minY + 110,
    250
  );
  topHighlight.addColorStop(0, "rgba(255,255,255,0.24)");
  topHighlight.addColorStop(1, "rgba(255,255,255,0)");
  targetContext.fillStyle = topHighlight;
  targetContext.fillRect(HAT_BOUNDS.minX, HAT_BOUNDS.minY, HAT_BOUNDS.maxX - HAT_BOUNDS.minX, HAT_BOUNDS.maxY - HAT_BOUNDS.minY);

  targetContext.strokeStyle = "rgba(255,255,255,0.12)";
  targetContext.lineWidth = 5;
  const foldLines = [612, 656, 700, 744, 788];
  foldLines.forEach((lineX, index) => {
    const offset = index % 2 === 0 ? 14 : -10;
    targetContext.beginPath();
    targetContext.moveTo(HAT_BOUNDS.centerX, HAT_BOUNDS.minY + 24);
    targetContext.quadraticCurveTo(lineX, HAT_BOUNDS.centerY - 48, lineX + offset, HAT_BOUNDS.maxY - 22);
    targetContext.stroke();
  });

  targetContext.restore();
}

function drawPompom(targetContext) {
  if (!state.pompom.visible) {
    return;
  }

  const dots = [
    { x: 0, y: 0, r: 1 },
    { x: -0.48, y: 0.12, r: 0.68 },
    { x: 0.46, y: 0.1, r: 0.66 },
    { x: -0.1, y: -0.46, r: 0.62 },
    { x: 0.2, y: -0.4, r: 0.58 },
    { x: -0.34, y: -0.18, r: 0.48 },
    { x: 0.38, y: -0.18, r: 0.48 },
    { x: 0.04, y: 0.42, r: 0.56 },
  ];

  targetContext.save();
  dots.forEach((dot, index) => {
    const radius = state.pompom.size * dot.r;
    const x = POMPOM_CENTER.x + dot.x * state.pompom.size;
    const y = POMPOM_CENTER.y + dot.y * state.pompom.size;
    const gradient = targetContext.createRadialGradient(
      x - radius * 0.36,
      y - radius * 0.34,
      radius * 0.12,
      x,
      y,
      radius
    );
    gradient.addColorStop(0, lightenColor(state.pompom.color, 20));
    gradient.addColorStop(0.72, state.pompom.color);
    gradient.addColorStop(1, darkenColor(state.pompom.color, 26 + index));
    targetContext.fillStyle = gradient;
    targetContext.beginPath();
    targetContext.arc(x, y, radius, 0, Math.PI * 2);
    targetContext.fill();
  });
  targetContext.restore();
}

function drawRibbonTexture(targetContext) {
  targetContext.save();
  buildRibbonPath(targetContext);
  targetContext.clip();

  const shadow = targetContext.createLinearGradient(450, 1090, 940, 1470);
  shadow.addColorStop(0, "rgba(0, 0, 0, 0.14)");
  shadow.addColorStop(0.45, "rgba(255, 255, 255, 0.08)");
  shadow.addColorStop(1, "rgba(0, 0, 0, 0.18)");
  targetContext.fillStyle = shadow;
  targetContext.fillRect(420, 1070, 580, 420);

  targetContext.strokeStyle = "rgba(255,255,255,0.16)";
  targetContext.lineWidth = 3.5;
  const foldLines = [
    [492, 1120, 658, 1172],
    [560, 1104, 682, 1152],
    [788, 1108, 918, 1166],
    [694, 1210, 688, 1450],
    [748, 1204, 794, 1446],
  ];
  foldLines.forEach(([x1, y1, x2, y2]) => {
    targetContext.beginPath();
    targetContext.moveTo(x1, y1);
    targetContext.lineTo(x2, y2);
    targetContext.stroke();
  });

  targetContext.strokeStyle = "rgba(0,0,0,0.12)";
  targetContext.lineWidth = 2;
  Object.values(RIBBON_PARTS).forEach((polygon) => {
    targetContext.beginPath();
    targetContext.moveTo(polygon[0].x, polygon[0].y);
    for (let i = 1; i < polygon.length; i += 1) {
      targetContext.lineTo(polygon[i].x, polygon[i].y);
    }
    targetContext.closePath();
    targetContext.stroke();
  });

  targetContext.restore();
}

function drawLogo(targetContext) {
  if (!state.logo.image) {
    return;
  }

  targetContext.save();
  buildHatPath(targetContext);
  targetContext.clip();

  const image = state.logo.image;
  const fit = Math.min(220 / image.width, 120 / image.height);
  const scale = fit * (state.logo.scale / 100);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const drawX = LOGO_ANCHOR.x + state.logo.offsetX - drawWidth / 2;
  const drawY = LOGO_ANCHOR.y + state.logo.offsetY - drawHeight / 2;
  targetContext.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  targetContext.restore();
}

function drawText(targetContext) {
  if (!state.text.value.trim()) {
    return;
  }

  targetContext.save();
  buildHatPath(targetContext);
  targetContext.clip();
  targetContext.textAlign = "center";
  targetContext.textBaseline = "middle";
  targetContext.fillStyle = state.text.color;
  targetContext.strokeStyle = "rgba(255, 255, 255, 0.26)";
  targetContext.lineWidth = Math.max(1.5, state.text.size * 0.035);
  targetContext.font = getTextFont();
  const lines = state.text.value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line, index, all) => line.length > 0 || all.length === 1)
    .slice(0, 4);
  const lineHeight = state.text.size * 1.2;
  const startY = TEXT_ANCHOR.y + state.text.offsetY - ((lines.length - 1) * lineHeight * 0.5);
  lines.forEach((line, index) => {
    const x = TEXT_ANCHOR.x + state.text.offsetX;
    const y = startY + index * lineHeight;
    targetContext.strokeText(line, x, y);
    targetContext.fillText(line, x, y);
  });
  targetContext.restore();
}

function drawMaskComposite(targetContext) {
  drawFabricFill(targetContext, buildHatPath, FABRIC_REFERENCE);
  drawFabricFill(targetContext, buildRibbonPath, RIBBON_REFERENCE);
  drawHatTexture(targetContext);
  drawRibbonTexture(targetContext);
  drawLogo(targetContext);
  drawText(targetContext);
  drawPompom(targetContext);
}

function drawModelBackground(targetContext, width, height) {
  targetContext.fillStyle = "#ffffff";
  targetContext.fillRect(0, 0, width, height);

  if (!state.model.image) {
    drawMissingModelMessage(targetContext, width, height);
    return;
  }

  const image = state.model.image;
  const scale = Math.min(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const drawX = (width - drawWidth) / 2;
  const drawY = (height - drawHeight) / 2;
  targetContext.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function drawMissingModelMessage(targetContext, width, height) {
  targetContext.fillStyle = "#ffffff";
  targetContext.fillRect(0, 0, width, height);
  targetContext.strokeStyle = "#d9cabc";
  targetContext.lineWidth = 4;
  targetContext.strokeRect(28, 28, width - 56, height - 56);
  targetContext.fillStyle = "#7f6a59";
  targetContext.textAlign = "center";
  targetContext.textBaseline = "middle";
  targetContext.font = '700 42px "Malgun Gothic", sans-serif';
  targetContext.fillText("model.jpg 가 필요합니다", width * 0.5, height * 0.48);
  targetContext.font = '500 28px "Malgun Gothic", sans-serif';
  targetContext.fillText("실제 아기 사진을 model.jpg 로 넣어주세요", width * 0.5, height * 0.54);
}

function renderComposite(targetContext = ctx, includeModel = true) {
  const width = targetContext.canvas.width;
  const height = targetContext.canvas.height;
  targetContext.clearRect(0, 0, width, height);

  if (includeModel) {
    drawModelBackground(targetContext, width, height);
    if (!state.model.image) {
      return;
    }
  }

  drawMaskComposite(targetContext);
}

function loadImageFromFile(file, onLoaded) {
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const image = new Image();
    image.onload = () => onLoaded(image, file.name);
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function loadModelImage() {
  const image = new Image();
  image.onload = () => {
    state.model.image = image;
    modelStatus.textContent = "실제 model.jpg 기준 미리보기";
    renderComposite();
  };
  image.onerror = () => {
    state.model.image = null;
    modelStatus.textContent = "실제 model.jpg 파일을 기다리는 중";
    renderComposite();
  };
  image.src = MODEL_SOURCE;
}

function syncControlsFromState() {
  controls.fabricScale.value = state.fabric.scale;
  controls.fabricOffsetX.value = state.fabric.offsetX;
  controls.fabricOffsetY.value = state.fabric.offsetY;
  controls.fabricRotation.value = state.fabric.rotation;
  controls.patternRepeat.checked = state.fabric.repeat;
  controls.showPompom.checked = state.pompom.visible;
  controls.pompomColor.value = state.pompom.color;
  controls.pompomSize.value = state.pompom.size;
  controls.logoText.value = state.text.value;
  controls.textFont.value = state.text.fontPreset;
  controls.textColor.value = state.text.color;
  controls.textSize.value = state.text.size;
  controls.textOffsetX.value = state.text.offsetX;
  controls.textOffsetY.value = state.text.offsetY;
  controls.logoScale.value = state.logo.scale;
  controls.logoOffsetX.value = state.logo.offsetX;
  controls.logoOffsetY.value = state.logo.offsetY;
}

function updateValueLabels() {
  valueLabels.fabricScale.textContent = `${state.fabric.scale}%`;
  valueLabels.fabricOffsetX.textContent = `${state.fabric.offsetX}`;
  valueLabels.fabricOffsetY.textContent = `${state.fabric.offsetY}`;
  valueLabels.fabricRotation.textContent = `${state.fabric.rotation}°`;
  valueLabels.pompomColor.textContent = state.pompom.color;
  valueLabels.pompomSize.textContent = `${state.pompom.size}`;
  valueLabels.textColor.textContent = state.text.color;
  valueLabels.textSize.textContent = `${state.text.size}`;
  valueLabels.textOffsetX.textContent = `${state.text.offsetX}`;
  valueLabels.textOffsetY.textContent = `${state.text.offsetY}`;
  valueLabels.logoScale.textContent = `${state.logo.scale}%`;
  valueLabels.logoOffsetX.textContent = `${state.logo.offsetX}`;
  valueLabels.logoOffsetY.textContent = `${state.logo.offsetY}`;
}

function bindInput(control, onChange) {
  control.addEventListener("input", () => {
    onChange(control);
    updateValueLabels();
    renderComposite();
  });
}

function getTextFont() {
  if (state.text.fontPreset === "script") {
    return `400 ${state.text.size}px "Brush Script MT", "Segoe Script", cursive`;
  }

  if (state.text.fontPreset === "bold") {
    return `900 ${state.text.size}px "Malgun Gothic", "Apple SD Gothic Neo", sans-serif`;
  }

  return `600 ${state.text.size}px "Malgun Gothic", "Apple SD Gothic Neo", sans-serif`;
}

function downloadCompositePng() {
  if (!state.model.image) {
    window.alert("model.jpg 파일이 있어야 저장할 수 있습니다.");
    return;
  }

  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = canvas.width;
  exportCanvas.height = canvas.height;
  const exportContext = exportCanvas.getContext("2d");
  renderComposite(exportContext, true);

  const link = document.createElement("a");
  link.download = "partyhat-composite.png";
  link.href = exportCanvas.toDataURL("image/png");
  link.click();
}

function downloadTransparentHatPng() {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = canvas.width;
  exportCanvas.height = canvas.height;
  const exportContext = exportCanvas.getContext("2d");
  renderComposite(exportContext, false);

  const link = document.createElement("a");
  link.download = "partyhat-mask-layer.png";
  link.href = exportCanvas.toDataURL("image/png");
  link.click();
}

function darkenColor(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    Math.max(0, r - amount),
    Math.max(0, g - amount),
    Math.max(0, b - amount)
  );
}

function lightenColor(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    Math.min(255, r + amount),
    Math.min(255, g + amount),
    Math.min(255, b + amount)
  );
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const safe = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;
  const numeric = Number.parseInt(safe, 16);
  return {
    r: (numeric >> 16) & 255,
    g: (numeric >> 8) & 255,
    b: numeric & 255,
  };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

bindInput(controls.fabricScale, (control) => {
  state.fabric.scale = Number(control.value);
});

bindInput(controls.fabricOffsetX, (control) => {
  state.fabric.offsetX = Number(control.value);
});

bindInput(controls.fabricOffsetY, (control) => {
  state.fabric.offsetY = Number(control.value);
});

bindInput(controls.fabricRotation, (control) => {
  state.fabric.rotation = Number(control.value);
});

bindInput(controls.patternRepeat, (control) => {
  state.fabric.repeat = control.checked;
});

bindInput(controls.showPompom, (control) => {
  state.pompom.visible = control.checked;
});

bindInput(controls.pompomColor, (control) => {
  state.pompom.color = control.value;
});

bindInput(controls.pompomSize, (control) => {
  state.pompom.size = Number(control.value);
});

bindInput(controls.logoText, (control) => {
  state.text.value = control.value;
});

bindInput(controls.textFont, (control) => {
  state.text.fontPreset = control.value;
});

bindInput(controls.textColor, (control) => {
  state.text.color = control.value;
});

bindInput(controls.textSize, (control) => {
  state.text.size = Number(control.value);
});

bindInput(controls.textOffsetX, (control) => {
  state.text.offsetX = Number(control.value);
});

bindInput(controls.textOffsetY, (control) => {
  state.text.offsetY = Number(control.value);
});

bindInput(controls.logoScale, (control) => {
  state.logo.scale = Number(control.value);
});

bindInput(controls.logoOffsetX, (control) => {
  state.logo.offsetX = Number(control.value);
});

bindInput(controls.logoOffsetY, (control) => {
  state.logo.offsetY = Number(control.value);
});

controls.fabricUpload.addEventListener("change", (event) => {
  const [file] = event.target.files;
  loadImageFromFile(file, (image, fileName) => {
    state.fabric.image = image;
    state.fabric.name = fileName;
    fabricStatus.textContent = `원단 이미지 "${fileName}" 를 불러왔습니다. 기존 고깔과 턱 리본에 함께 적용됩니다.`;
    renderComposite();
  });
});

controls.logoUpload.addEventListener("change", (event) => {
  const [file] = event.target.files;
  loadImageFromFile(file, (image, fileName) => {
    state.logo.image = image;
    state.logo.name = fileName;
    renderComposite();
  });
});

controls.resetFabricBtn.addEventListener("click", () => {
  state.fabric.scale = 100;
  state.fabric.offsetX = 0;
  state.fabric.offsetY = 0;
  state.fabric.rotation = 0;
  syncControlsFromState();
  updateValueLabels();
  renderComposite();
});

controls.clearLogoBtn.addEventListener("click", () => {
  state.logo.image = null;
  state.logo.name = "";
  controls.logoUpload.value = "";
  renderComposite();
});

controls.downloadBtn.addEventListener("click", () => {
  downloadCompositePng();
});

controls.downloadTransparentBtn.addEventListener("click", () => {
  downloadTransparentHatPng();
});

syncControlsFromState();
updateValueLabels();
loadModelImage();
