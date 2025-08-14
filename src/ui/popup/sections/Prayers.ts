import { DateTime } from "luxon";
import { getTodayPrayers, getNextPrayer } from "../../../lib/prayer";
import { getSettings, getLocation } from "../../../lib/storage";
import { getMessage } from "../../../lib/i18n";

/**
 * Renders a stepper-based prayer timeline similar to Vue stepper.
 */
export async function render(): Promise<HTMLElement> {
  const card = document.createElement("div");
  card.className = "card";

  // Create stepper container
  const stepperContainer = document.createElement("div");
  stepperContainer.className = "prayer-stepper";

  try {
    const settings = await getSettings();
    const loc = await getLocation();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const prayers = getTodayPrayers(
      {
        method: settings.method,
        madhab: settings.madhab,
        latitudeRule: settings.latitudeRule,
      },
      { lat: loc.lat, lon: loc.lon, tz }
    ).filter((p) =>
      ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].includes(p.name)
    );

    // Create praytimeJSON object similar to Vue data
    const praytimeJSON = {
      fajr: DateTime.fromISO(
        prayers.find((p) => p.name === "Fajr")?.timeISO || ""
      ).toFormat("h:mm a"),
      dhuhr: DateTime.fromISO(
        prayers.find((p) => p.name === "Dhuhr")?.timeISO || ""
      ).toFormat("h:mm a"),
      asr: DateTime.fromISO(
        prayers.find((p) => p.name === "Asr")?.timeISO || ""
      ).toFormat("h:mm a"),
      maghrib: DateTime.fromISO(
        prayers.find((p) => p.name === "Maghrib")?.timeISO || ""
      ).toFormat("h:mm a"),
      isha: DateTime.fromISO(
        prayers.find((p) => p.name === "Isha")?.timeISO || ""
      ).toFormat("h:mm a"),
    };

    // Calculate current step based on time
    const now = DateTime.now().setZone(tz);
    let currentStep = 0;
    prayers.forEach((prayer, index) => {
      const prayerTime = DateTime.fromISO(prayer.timeISO);
      if (now < prayerTime) {
        if (currentStep === 0) currentStep = index + 1;
      }
    });

    // Create stepper header
    const stepperHeader = document.createElement("div");
    stepperHeader.className = "stepper-header unclickable";

    // Prayer steps data
    const prayerSteps = [
      { title: "Fajr", value: 1, time: praytimeJSON.fajr },
      { title: "Dhuhr", value: 2, time: praytimeJSON.dhuhr },
      { title: "Asr", value: 3, time: praytimeJSON.asr },
      { title: "Maghrib", value: 4, time: praytimeJSON.maghrib },
      { title: "Isha", value: 5, time: praytimeJSON.isha },
    ];

    prayerSteps.forEach((step, index) => {
      // Create stepper item
      const stepperItem = document.createElement("div");
      stepperItem.className = "stepper-item";
      stepperItem.setAttribute("data-value", step.value.toString());

      // Add color based on current step
      if (currentStep >= step.value) {
        stepperItem.style.color = "#009900";
      }

      // Create title
      const title = document.createElement("div");
      title.className = "stepper-title";
      title.textContent = getMessage(`prayer_${step.title.toLowerCase()}`);

      // Create time
      const time = document.createElement("div");
      time.className = "stepper-time";
      time.textContent = step.time;

      stepperItem.appendChild(title);
      stepperItem.appendChild(time);

      // Add divider after each item (except the last one)
      if (index < prayerSteps.length - 1) {
        const divider = document.createElement("hr");
        divider.className = "v-divider v-theme--light border-opacity-25";
        divider.setAttribute("aria-orientation", "horizontal");
        divider.setAttribute("role", "separator");
        divider.style.borderTopWidth = "3px";
        divider.style.color =
          currentStep > step.value ? "rgb(0, 153, 0)" : "rgb(224, 224, 224)";
        divider.style.caretColor =
          currentStep > step.value ? "rgb(0, 153, 0)" : "rgb(224, 224, 224)";
        divider.style.padding = "0px 7px";
        divider.style.flex = "1";

        stepperHeader.appendChild(stepperItem);
        stepperHeader.appendChild(divider);
      } else {
        stepperHeader.appendChild(stepperItem);
      }
    });

    stepperContainer.appendChild(stepperHeader);
    card.appendChild(stepperContainer);

    // Add CSS styles for the stepper
    const style = document.createElement("style");
    style.textContent = `
      .prayer-stepper {
        padding: 16px;
      }
      .stepper-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }
      .stepper-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 80px;
        padding: 8px;
        border-radius: 8px;
        transition: all 0.3s ease;
      }
      .stepper-title {
        font-weight: 600;
        font-size: 12px;
        margin-bottom: 4px;
        text-align: center;
      }
      .stepper-time {
        font-size: 14px;
        font-weight: 500;
      }
      .v-divider {
        border-radius: 2px;
      }
      .unclickable {
        pointer-events: none;
      }
    `;
    card.appendChild(style);
  } catch {
    card.textContent = getMessage("error_generic");
  }

  return card;
}
