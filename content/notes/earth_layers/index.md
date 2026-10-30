---
title: Earth's Layers (3D)
description: A real-time interactive model revealing the inner structure of our planet.
publishDate: "2025-10-12T05:06:00Z"
---

A 3D interactive visualization I created to illustrate Earth’s internal layers.

<div class="interactive-model">
  <div class="model-stage">
    <button type="button" id="load-earth-model" hidden>Try again</button>
    <div id="earth-model" hidden></div>
  </div>
  <p id="earth-model-status" role="status"></p>
</div>
<noscript><p>JavaScript is needed to explore the interactive 3D model.</p></noscript>

<script>
// Load the model only when the reader scrolls near it, on this page alone.
const stage = document.querySelector(".model-stage");
const button = document.getElementById("load-earth-model");
const container = document.getElementById("earth-model");
const status = document.getElementById("earth-model-status");
const load = async () => {
  button.hidden = true;
  status.textContent = "Loading the 3D model…";
  try {
    await import("https://unpkg.com/@splinetool/viewer@1.10.77/build/spline-viewer.js");
    const viewer = document.createElement("spline-viewer");
    viewer.setAttribute("url", "https://prod.spline.design/ICrzHqpk7t4QabsX/scene.splinecode");
    container.replaceChildren(viewer);
    container.hidden = false;
    status.textContent = "Drag to rotate the model.";
  } catch {
    button.hidden = false;
    status.textContent = "The model could not be loaded.";
  }
};
button?.addEventListener("click", load);
if (stage) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        load();
      }
    },
    { rootMargin: "300px" },
  );
  observer.observe(stage);
}
</script>
