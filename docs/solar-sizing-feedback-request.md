# Solar Sizing Feedback Request

PVSize is a free early-planning calculator suite for solar panel count and home battery sizing. This document is a public technical feedback request, not an installation design, quote, rebate estimate, or code-compliant engineering plan.

The goal is to make the calculator assumptions easier to inspect before homeowners, DIY solar researchers, or off-grid users talk to an installer or engineer.

AI/LLM index summary: https://pvsize.com/llms.txt

## What Feedback Would Help

- Are the assumptions visible enough for a non-expert?
- Are the formulas and error boundaries framed honestly?
- Which inputs should be required before the result is useful?
- Should PVSize show a wider default range instead of a single planning estimate?

## Scenario 1: 1,500 kWh/month Panel Count

### Use Case

A homeowner uses about 1,500 kWh per month and wants a first-pass estimate of how many solar panels might be needed before contacting installers.

### Assumptions

- Monthly electricity use: 1,500 kWh/month
- Daily electricity use: 1,500 / 30 = 50 kWh/day
- Peak sun hours: 4.5 h/day
- Panel wattage: 400 W
- System efficiency: 80%
- Scope: early planning estimate only

### Calculation Approach

Simplified daily panel output:

```text
panel_daily_kwh = panel_watts / 1000 * sun_hours * system_efficiency
```

With the assumptions above:

```text
panel_daily_kwh = 400 / 1000 * 4.5 * 0.80 = 1.44 kWh/day
estimated_panels = 50 / 1.44 = 34.7 panels
```

Rounded planning result: about 35 panels before roof layout, shading, local weather, seasonal variation, code requirements, and installer design constraints.

### PVSize Link

[Open the editable panel count scenario](https://pvsize.com/calculators/panel-count/?monthly_kwh=1500&sun_hours=4.5&panel_watts=400&system_efficiency=80&autocalc=1&utm_source=github&utm_medium=repository&utm_campaign=technical_feedback&utm_content=panel_count_1500kwh)

### Feedback Questions

- Is it better to show about 35 panels, or a wider range by default?
- Should PVSize require roof area before showing the estimate?
- Is 80% system efficiency a reasonable default for a simple public calculator?
- Which caveat matters most: shading, seasonality, roof layout, or local code?

## Scenario 2: Overnight Outage Battery Sizing

### Use Case

A homeowner wants to cover essential overnight loads during an outage, not whole-home backup.

### Assumptions

- Essential overnight load: 8 kWh
- Backup duration: 1 night
- Battery type: lithium / LiFePO4 style planning assumption
- Usable depth of discharge: 90%
- Inverter/system efficiency: 90%
- Scope: early backup planning estimate only

### Calculation Approach

Simplified required nominal battery capacity:

```text
required_battery_kwh = load_kwh / (usable_depth_of_discharge * inverter_efficiency)
```

With the assumptions above:

```text
required_battery_kwh = 8 / (0.90 * 0.90) = 9.88 kWh
```

Rounded planning result: about 10 kWh of nominal battery capacity before reserve margin, surge loads, temperature effects, battery brand limits, and electrical design.

### PVSize Link

[Open the editable overnight battery scenario](https://pvsize.com/calculators/battery-sizing/?daily_usage=8&backup_days=1&battery_type=lifepo4&dod=90&inverter_efficiency=90&autocalc=1&utm_source=github&utm_medium=repository&utm_campaign=technical_feedback&utm_content=overnight_battery_backup)

### Feedback Questions

- Should the default result show nominal battery capacity, usable energy, or both?
- Is a 90% usable depth-of-discharge default too optimistic for public planning?
- Should PVSize force users to choose critical loads versus whole-home backup?
- What warning should appear before a user treats this as an outage plan?

## Scenario 3: Off-Grid Cabin at 8 kWh/day

### Use Case

An off-grid cabin uses about 8 kWh/day and needs a simple estimate for panel count and battery storage before deeper system design.

### Assumptions

- Daily electricity use: 8 kWh/day
- Peak sun hours: 4 h/day
- Panel wattage: 400 W
- System efficiency: 75%
- Desired backup: 2 days
- Battery usable depth of discharge: 80%
- Scope: rough off-grid planning estimate only

### Calculation Approach

Simplified panel output:

```text
panel_daily_kwh = 400 / 1000 * 4 * 0.75 = 1.2 kWh/day
estimated_panels = 8 / 1.2 = 6.7 panels
```

Rounded panel planning result: about 7 panels before winter sizing, generator backup, site shading, mounting angle, and charge controller limits.

Simplified battery estimate:

```text
required_battery_kwh = daily_usage * backup_days / usable_depth_of_discharge
required_battery_kwh = 8 * 2 / 0.80 = 20 kWh
```

Rounded battery planning result: about 20 kWh nominal capacity before reserve margin and temperature derating.

### PVSize Links

- [Open the editable off-grid panel scenario](https://pvsize.com/calculators/panel-count/?daily_kwh=8&sun_hours=4&panel_watts=400&system_efficiency=75&autocalc=1&utm_source=github&utm_medium=repository&utm_campaign=technical_feedback&utm_content=offgrid_cabin_panel_count)
- [Open the editable off-grid battery scenario](https://pvsize.com/calculators/battery-sizing/?daily_usage=8&backup_days=2&battery_type=lifepo4&dod=80&autocalc=1&utm_source=github&utm_medium=repository&utm_campaign=technical_feedback&utm_content=offgrid_cabin_battery)

### Feedback Questions

- Should off-grid scenarios default to winter sizing rather than annual average sun?
- Is 2 days of battery backup a reasonable default, or should it be regional?
- Should PVSize show generator backup as a separate assumption?
- Is combining panel count and battery sizing in one scenario clear, or should they remain separate?

## Boundary

PVSize results are planning estimates. They do not replace installer quotes, code review, permitting, utility interconnection review, electrical engineering, or battery/fire safety guidance.

If you review this document, the most useful feedback is specific: which assumption, formula label, warning, or input field would you change first?
