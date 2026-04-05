/**
 * Dedicated SEO service landing pages under /services/{slug}/
 */

import { PHONE_DISPLAY } from '@/lib/site'

export const SERVICE_PAGE_SLUGS = [
  'garage-door-installation',
  'garage-door-repair',
  'emergency-garage-door-repair',
  'garage-door-openers',
  'hurricane-rated-garage-doors',
  'commercial-garage-doors',
] as const

export type ServicePageSlug = (typeof SERVICE_PAGE_SLUGS)[number]

export type ServiceFaqItem = {
  question: string
  answer: string
}

export type ServicePageContent = {
  slug: ServicePageSlug
  /** Meta & OG title */
  pageTitle: string
  /** Short label for breadcrumb trail */
  navLabel: string
  metaDescription: string
  keywords: readonly string[]
  /** Split headline to match MarketingHero (accent is blue + underline) */
  heroHeadingBefore: string
  heroHeadingAccent: string
  lead: string
  /** Heading above bullet list below hero image */
  trustHeading: string
  /** Supporting copy below bullets (SEO body, trust) */
  belowHeroParagraphs: readonly string[]
  imageSrc: string
  imageAlt: string
  sections: readonly { heading: string; paragraphs: readonly string[] }[]
  bullets: readonly string[]
  faqs: readonly ServiceFaqItem[]
}

const SERVICES: Record<ServicePageSlug, ServicePageContent> = {
  'garage-door-installation': {
    slug: 'garage-door-installation',
    pageTitle:
      'Garage Door Installation South Florida | New Doors & Replacement | 305 Doors Corp',
    navLabel: 'Installation & replacement',
    metaDescription: `Expert garage door installation in Miami-Dade, Broward, Palm Beach, Lee, Collier & Monroe Counties. Insulated, hurricane-rated, carriage-house & modern glass doors. Written estimates. Call ${PHONE_DISPLAY}.`,
    keywords: [
      'garage door installation South Florida',
      'new garage door installation Miami',
      'garage door replacement Broward County',
      'garage door replacement Palm Beach',
      'insulated garage door installation Florida',
      'residential garage door installation',
      'custom garage door install Miami',
      'two-car garage door installation',
      'garage door installer near me',
    ],
    heroHeadingBefore: 'Garage door installation & replacement in ',
    heroHeadingAccent: 'South Florida',
    lead: `305 Doors Corp designs and installs residential and commercial garage doors for homes, townhomes, condos, and businesses from Miami and Fort Lauderdale through Palm Beach, Naples, Fort Myers, and the Keys. Whether you need a like-for-like replacement, a full style upgrade, or a wind-rated assembly for coastal exposure, we help you compare options honestly — then install with balanced hardware, aligned safety sensors, and weather sealing where it counts.`,
    trustHeading: 'What you get with every installation',
    belowHeroParagraphs: [
      `South Florida’s heat, humidity, and salt air punish cheap hardware and thin steel. We specify doors, springs, and operators matched to door weight and cycle expectations so you are not back on the phone in two seasons. That includes Miami-Dade and Broward inland neighborhoods, Palm Beach waterfront properties, and Monroe County homes where logistics and storm season both matter.`,
      `If you are working with an HOA or architect, we can align panel style, color, and window layouts with approved designs. For new construction and remodels, we coordinate rough opening dimensions, headroom, and side-room so tracks, operators, and low-headroom kits fit without surprises at trim-out.`,
      `Not sure whether to repair or replace? We walk through panel condition, insulation value, hardware wear, and long-term cost so you can decide with clear numbers — not pressure.`,
    ],
    imageSrc: '/images/305doors/gallery/latest-work/latest-work-01.jpeg',
    imageAlt:
      'Professional garage door installation on a South Florida home — sectional door and hardware by 305 Doors Corp',
    sections: [
      {
        heading: 'Residential garage door styles we install',
        paragraphs: [
          `Raised-panel and stamped steel remain the workhorses of suburban Florida — cost-effective, available in insulated and non-insulated models, and easy to match to existing homes in Coral Springs, Weston, Kendall, and similar markets. Carriage-house overlays and wood-tone finishes add curb appeal without the maintenance of real wood in our climate.`,
          `Contemporary homes often call for full-view aluminum sections, frosted glass, or narrow-profile frames that complement modern architecture from Miami Beach to downtown West Palm. We help you balance aesthetics, privacy, and energy performance when the garage shares a wall with conditioned space.`,
          `Wind-rated and reinforced assemblies are available for both new installs and replacements when your exposure category, insurer, or local amendment requires documented performance. We treat the door, track, jamb attachments, and operator settings as one system — not a sticker on a standard door.`,
        ],
      },
      {
        heading: 'Insulation, noise, and attached garages',
        paragraphs: [
          `Attached garages in South Florida often sit next to bedrooms, home offices, or rental units. Insulated sections with quality weatherstrip can reduce heat transfer, cut street noise, and make the bay more comfortable when you use it as workshop or storage. We explain R-value and construction honestly — including when a mid-tier insulated door is the sweet spot for your budget.`,
          `If you are replacing a non-insulated door on a cooled garage or ADU conversion, we factor vapor, drainage, and operator power so the new door does not strain the motor or void warranties.`,
        ],
      },
      {
        heading: 'Replacement when repair is no longer economical',
        paragraphs: [
          `Delaminated sections, rusted bottom fixtures, repeated spring failures, or obsolete one-piece tilt doors can exceed the value of continued repairs — especially when insurance or resale benefits from a documented upgrade. We itemize what is salvageable, what is not, and what lead times look like for your chosen style.`,
          `Panel replacement is sometimes an option when damage is localized and matching sections exist; when it is not, we help you select a full door that fits the opening without custom-field surprises.`,
        ],
      },
      {
        heading: 'Openers, accessories, and smart access',
        paragraphs: [
          `New doors are the right time to evaluate operator age, drive type, and accessories. Belt-drive units reduce noise for rooms above the garage; jackshaft operators free ceiling space in low-headroom or high-lift layouts; battery backup and Wi-Fi features are increasingly important for Florida buyers and code discussions in some jurisdictions.`,
          `We program remotes, keypads, and vehicle buttons, set force and travel limits, and verify safety reversal before we leave — so your opener and door work together on day one.`,
        ],
      },
      {
        heading: 'Commercial and multi-family installation',
        paragraphs: [
          `We install sectional and rolling steel doors for retail bays, warehouse docks, storage facilities, parking structures, and multi-family buildings. Specs emphasize cycle life, wind load where required, and operators sized for daily traffic — not residential hardware dressed up for commercial duty.`,
          `General contractors and property managers can rely on us for submittal-friendly documentation, sequencing around electrical and fire alarm, and commissioning support at inspection.`,
        ],
      },
      {
        heading: 'Service area & scheduling',
        paragraphs: [
          `Our installation crews run regular routes across Miami-Dade, Broward, Palm Beach, Lee, Collier, and Monroe Counties. Lead times vary by manufacturer, custom options, and seasonal demand — especially before hurricane season. We quote realistic arrival windows for materials and labor so you can plan around movers, painters, and inspections.`,
          `Call ${PHONE_DISPLAY} for a written estimate, or use the quote form on this page to describe your opening size, photos, and goals.`,
        ],
      },
    ],
    bullets: [
      'Written estimates and clear scope before work begins',
      'Wind-rated and impact-minded options for Florida exposure',
      'Insulated steel, carriage-house, and full-view contemporary lines',
      'Opener pairing: belt, chain, jackshaft, battery backup, smart-ready',
      'HOA-friendly style and color coordination when required',
      'Balance, safety sensor, and weatherstrip checks on every install',
      'Commercial sectional and roll-up doors for high-cycle use',
      'Six-county coverage: Miami-Dade through the Keys',
    ],
    faqs: [
      {
        question: 'How long does garage door installation take?',
        answer:
          'Most residential replacements complete in one day once all materials are on site. Custom doors, specialty glass, or inspection requirements can extend the timeline — we communicate realistic windows when we quote.',
      },
      {
        question: 'Do you install hurricane-rated garage doors?',
        answer:
          'Yes. We install wind-rated assemblies and reinforced hardware appropriate for your address and project requirements, with documentation suitable for your records and many insurer conversations.',
      },
      {
        question: 'Can you match my home’s style or HOA guidelines?',
        answer:
          'In most cases, yes. We offer multiple panel designs, window layouts, and color finishes and can align with HOA submission packages when you share the requirements.',
      },
      {
        question: 'Will a new door work with my existing opener?',
        answer:
          'Often yes if the operator is correctly sized and in good condition. Sometimes a new door’s weight or high-lift geometry requires an upgrade — we test balance and motor load and explain before we proceed.',
      },
      {
        question: 'Do you haul away the old door?',
        answer:
          'We can include removal and disposal in the project scope when you book installation — ask when you request your estimate.',
      },
      {
        question: 'What counties do you serve for installation?',
        answer:
          'Miami-Dade, Broward, Palm Beach, Lee, Collier, and Monroe Counties, including the Florida Keys. Remote or island locations may affect scheduling; we set expectations when you call.',
      },
    ],
  },

  'garage-door-repair': {
    slug: 'garage-door-repair',
    pageTitle:
      'Garage Door Repair South Florida | Springs, Cables, Openers | 305 Doors Corp',
    navLabel: 'Garage door repair',
    metaDescription: `Garage door repair in Miami-Dade, Broward, Palm Beach, Lee, Collier & Monroe: broken springs, cables, rollers, tracks, sensors & openers. Safe, transparent service. ${PHONE_DISPLAY}.`,
    keywords: [
      'garage door repair South Florida',
      'garage door spring repair Miami',
      'broken garage door cable repair',
      'garage door off track repair Broward',
      'garage door opener repair Palm Beach',
      'noisy garage door fix',
      'garage door roller replacement',
      'garage door sensor alignment',
    ],
    heroHeadingBefore: 'Garage door repair across ',
    heroHeadingAccent: 'South Florida',
    lead: `Broken springs, frayed cables, worn rollers, bent tracks, misaligned safety sensors, and failing openers are more than an inconvenience — they can be dangerous when high-tension hardware lets go or a door drops unexpectedly. 305 Doors Corp diagnoses the root cause, secures the door before we work, and repairs with parts matched to your door’s weight and usage. We serve houses, condos, townhomes, and commercial bays throughout Miami-Dade, Broward, Palm Beach, Lee, Collier, and Monroe Counties.`,
    trustHeading: 'How we approach every repair call',
    belowHeroParagraphs: [
      `Torsion and extension spring systems store significant energy. If you hear a loud bang from the garage, see a gap in the spring, or the door feels impossibly heavy, stop using the opener and keep people clear of the opening. We walk you through what is safe to check by phone and what should wait for a technician.`,
      `Florida’s humidity accelerates rust on bottom fixtures, cables, and hinges — especially near the coast. We look for corrosion, uneven wear, and binding that would break the next component after a quick patch, and we tell you when a repair is a short-term fix versus a lasting solution.`,
      `Commercial doors on high-cycle schedules need different parts than residential kits. We match springs, cables, and operators to real-world use so you are not replacing the same hardware every few months.`,
    ],
    imageSrc: '/images/305doors/gallery/latest-work/latest-work-12.jpeg',
    imageAlt:
      'Garage door repair and hardware service on a South Florida home — springs, tracks, and rollers by 305 Doors Corp',
    sections: [
      {
        heading: 'Spring replacement and balance',
        paragraphs: [
          `Springs are sized to door weight, drum geometry, and lift type. Replacing a spring with the wrong wire size or length leads to poor balance, opener strain, and premature failure. On dual-spring systems we typically replace both torsion springs together so lift and cycle life stay matched.`,
          `After spring work we check cable tension, drum wrap, and balance — and we verify that the opener’s force settings are appropriate for the restored door.`,
        ],
      },
      {
        heading: 'Cables, drums, and doors off track',
        paragraphs: [
          `Cables slip off drums when springs fail, tracks bend, or doors are hit by vehicles. We inspect the full system: rollers, hinges, track radius, and jamb alignment. Simply “hooking the cable back” without correcting the cause often fails within days.`,
          `Off-track doors may be under uneven load. We secure the door, relieve tension safely, then realign or replace track sections as needed before returning the door to service.`,
        ],
      },
      {
        heading: 'Rollers, hinges, and noisy operation',
        paragraphs: [
          `Grinding, popping, or shaking often traces to worn rollers, loose hardware, or dry bearings. We upgrade to nylon or sealed rollers where appropriate and torque fasteners to manufacturer specs so you get quieter, smoother travel without overtightening into distortion.`,
          `When noise comes from the operator — stripped gears, worn belts, or failing capacitors — we separate door issues from motor issues so you do not pay twice for the wrong repair.`,
        ],
      },
      {
        heading: 'Safety sensors, wiring, and control problems',
        paragraphs: [
          `Photo eyes must face each other cleanly and sit at the correct height. Sun glare, vibration, and accidental kicks are common causes of “door won’t close” complaints. We align, shield, or reroute wiring when needed and test reversal under load.`,
          `Wall buttons, remotes, and logic boards each present different symptoms. We troubleshoot systematically rather than swapping parts at random.`,
        ],
      },
      {
        heading: 'Opener repair vs. replacement',
        paragraphs: [
          `We repair belt, chain, and jackshaft operators when parts remain available and the motor assembly is sound. When a unit is underpowered for a new door, obsolete, or repeatedly failing, we recommend replacement with clear reasoning and options for quiet drive, battery backup, and smart features.`,
        ],
      },
      {
        heading: 'Estimates, warranties, and service area',
        paragraphs: [
          `We explain what failed, what we recommend, and what it costs before we start whenever possible. Photo and video estimates can help for non-emergency work. Our service footprint covers Miami-Dade, Broward, Palm Beach, Lee, Collier, and Monroe Counties.`,
          `For urgent situations — a door stuck open overnight, a spring that failed with a car inside — ask about priority scheduling when you call ${PHONE_DISPLAY}.`,
        ],
      },
    ],
    bullets: [
      'Safety-first workflow on high-tension spring and cable work',
      'Torsion and extension spring replacement with balance testing',
      'Cable, drum, roller, hinge, and pulley service',
      'Track realignment, reinforcement, and section damage assessment',
      'Safety sensor alignment, wiring, and control troubleshooting',
      'Opener repair for major belt, chain, and jackshaft brands',
      'Commercial high-cycle hardware — not residential parts on dock doors',
      'Same-day and next-day appointments when capacity allows',
    ],
    faqs: [
      {
        question: 'Can I replace just one garage door spring?',
        answer:
          'On two-spring torsion systems we usually replace both springs together so lift, tension, and expected life stay balanced. A single spring change on a matched pair often leaves the older spring prone to immediate failure.',
      },
      {
        question: 'Why won’t my garage door close all the way?',
        answer:
          'Common causes include misaligned photo eyes, travel limit drift, damaged track, binding rollers, or obstruction signals. We test sensors, mechanical travel, and operator settings to isolate the issue.',
      },
      {
        question: 'Do you repair garage door openers on the same visit?',
        answer:
          'Yes when diagnostic parts are on the truck or quickly available. Some specialty boards or gear kits require ordering — we explain timelines before we proceed.',
      },
      {
        question: 'Is it safe to disengage the opener and lift the door manually?',
        answer:
          'Only if the door is properly balanced and you understand the weight. If a spring is broken, the door can be extremely heavy or fall when unsupported — call us instead of forcing it.',
      },
      {
        question: 'Do you offer commercial garage door repair?',
        answer:
          'Yes. We service rolling steel, sectional bays, and light industrial operators sized for daily truck traffic, with parts chosen for cycle life.',
      },
      {
        question: 'What areas do you serve?',
        answer:
          'Miami-Dade, Broward, Palm Beach, Lee, Collier, and Monroe Counties, including many Keys locations subject to drive-time scheduling.',
      },
    ],
  },

  'emergency-garage-door-repair': {
    slug: 'emergency-garage-door-repair',
    pageTitle:
      'Emergency Garage Door Repair South Florida | Fast Response | 305 Doors',
    navLabel: 'Emergency repair',
    metaDescription: `Emergency garage door repair: stuck open, broken spring, off-track, opener failure. Fast triage & dispatch across Miami-Dade, Broward, Palm Beach & surrounding counties. ${PHONE_DISPLAY}.`,
    keywords: [
      'emergency garage door repair Miami',
      'emergency garage door repair Fort Lauderdale',
      '24 hour garage door repair South Florida',
      'garage door stuck open repair',
      'urgent garage door spring repair',
      'same day garage door repair',
      'weekend garage door repair Florida',
    ],
    heroHeadingBefore: 'Emergency garage door repair in ',
    heroHeadingAccent: 'South Florida',
    lead: `When a door will not close at night, a spring lets go before a storm, or an opener dies with vehicles trapped inside, you need honest triage and a crew that prioritizes safety. Call ${PHONE_DISPLAY} — we advise what to do (and what not to do) from the first conversation, dispatch when technician capacity allows, and communicate realistic arrival windows. We cover Miami-Dade, Broward, Palm Beach, Lee, Collier, and Monroe Counties, including many Florida Keys routes where travel time affects scheduling.`,
    trustHeading: 'Urgent situations we prioritize',
    belowHeroParagraphs: [
      `Not every after-hours call requires a midnight truck roll — and we will say so. But when a door is hanging unevenly, cables are off drums, or the opening cannot be secured, we treat it as a safety and security priority and work through options including temporary securing until parts arrive.`,
      `True 24/7 coverage depends on technician availability and geography. When you call, you get a straight answer about the soonest window — tonight, early morning, or first truck out — instead of a vague promise.`,
      `Property managers and small businesses rely on us when a bay stuck open affects inventory, climate control, or overnight security. We document what we find for your maintenance logs when requested.`,
    ],
    imageSrc: '/images/305doors/gallery/latest-work/latest-work-09.jpeg',
    imageAlt:
      'Urgent garage door repair — sectional door and opener service when you cannot wait in South Florida',
    sections: [
      {
        heading: 'When to treat it as an emergency',
        paragraphs: [
          `Call immediately if the door appears crooked in the tracks, cables are slack or off drums, multiple rollers have popped out, or you suspect a spring failure and the door feels unstable. Keep children, pets, and vehicles clear of the opening until a technician assesses load and tension.`,
          `A door that will not close may leave your home or business exposed. We help you understand whether the issue is sensor-related and quick to fix versus mechanical failure requiring stabilization.`,
        ],
      },
      {
        heading: 'What we can often do on the first visit',
        paragraphs: [
          `Spring replacement with balance testing, cable re-termination, track realignment, roller reset, and manual disconnect / secure when an opener must be taken offline. If a specialty panel or operator must be ordered, we discuss temporary securement options such as anchoring the door or limiting travel until parts arrive.`,
        ],
      },
      {
        heading: 'After-hours, weekends, and holidays',
        paragraphs: [
          `Failures spike on weekends and before weather events. We return urgent voicemails and messages as quickly as we can and batch routing to minimize idle time across the region. Keys and western Collier routes may have longer transit — we factor that into the ETA you receive on the phone.`,
        ],
      },
      {
        heading: 'Commercial and multi-family emergencies',
        paragraphs: [
          `Parking garages, retail back-of-house, and warehouse doors often cannot stay open overnight. We carry commercial-grade fasteners and hardware where possible and can escalate to daytime crews for follow-up if a full operator swap or custom panel order is required.`,
        ],
      },
      {
        heading: 'Pricing and expectations',
        paragraphs: [
          `After-hours, weekend, or rush dispatch may carry different labor rates than standard business hours — we explain that before work begins when possible. You still get itemized scope: parts, labor, and any follow-up visit if materials must be ordered.`,
          `Photos and short videos help us bring the right springs or cables on the first trip; if you can share them safely, do.`,
        ],
      },
    ],
    bullets: [
      'Phone triage for safety before you touch high-tension hardware',
      'Broken spring replacement with post-repair balance checks',
      'Off-track stabilization and cable-off-drum recovery',
      'Opener failures trapping vehicles or blocking roll-up security',
      'Commercial bays that must close for overnight security',
      'Honest ETAs for Miami-Dade, Broward, Palm Beach, and beyond',
    ],
    faqs: [
      {
        question: 'Is emergency garage door repair more expensive?',
        answer:
          'After-hours or priority dispatch can affect labor rates compared with standard appointments. We quote scope and pricing before work when possible and explain any difference from regular service.',
      },
      {
        question: 'Can you secure my door if parts are not in stock?',
        answer:
          'Often yes. We may be able to secure the opening temporarily until the correct springs, panels, or operators arrive — especially important before weather events.',
      },
      {
        question: 'Do you serve the Florida Keys for emergencies?',
        answer:
          'Yes, Monroe County including the Keys is in our service area. Drive time, bridges, and weather can affect how quickly we arrive — we set realistic expectations when you call.',
      },
      {
        question: 'Should I try to close the door with the opener if it looks crooked?',
        answer:
          'No. Forcing an off-track or broken-spring door with the motor can bend track, strip gears, or cause the door to drop. Call us and keep the area clear.',
      },
      {
        question: 'How fast can you arrive in Broward or Palm Beach?',
        answer:
          'Arrival time depends on crew location and current call volume. When you call, we give our best window and update you if traffic or a prior job shifts timing.',
      },
      {
        question: 'Can you bill my property management company directly?',
        answer:
          'Often yes for established commercial accounts — bring your work order or billing details when you call so we can set paperwork up correctly.',
      },
    ],
  },

  'garage-door-openers': {
    slug: 'garage-door-openers',
    pageTitle:
      'Garage Door Opener Installation & Repair South Florida | Smart Openers | 305 Doors',
    navLabel: 'Openers & accessories',
    metaDescription: `Garage door opener install & repair: belt, chain, jackshaft, Wi-Fi, battery backup. Programming, sensors & limits. Miami-Dade through Monroe County. ${PHONE_DISPLAY}.`,
    keywords: [
      'garage door opener installation Miami',
      'garage door opener repair Broward',
      'smart garage door opener South Florida',
      'jackshaft garage door opener install',
      'wall mount garage door opener',
      'LiftMaster garage door opener installation',
      'garage door opener replacement Palm Beach',
      'battery backup garage door opener Florida',
    ],
    heroHeadingBefore: 'Garage door opener installation & repair in ',
    heroHeadingAccent: 'South Florida',
    lead: `The right operator depends on door weight, headroom, side room, ceiling height, and how often you cycle the door. 305 Doors Corp installs belt, chain, and jackshaft openers; configures remotes, keypads, and smart apps; and repairs motors, gears, belts, and logic boards when replacement is not yet justified. From quiet belt drives for attached garages in Weston and Aventura to commercial light-duty operators in Doral warehouses, we match equipment to real loads — not brochure headlines.`,
    trustHeading: 'Opener services we provide',
    belowHeroParagraphs: [
      `Florida’s heat and storms make battery backup and reliable wall controls more than convenience features for many buyers. We explain which opener features matter for your municipality, insurer, and household — and which are optional upsells.`,
      `Misadjusted travel limits and force settings cause premature wear and unsafe reversal behavior. Every install ends with mechanical safety checks, not just “it goes up and down.”`,
      `If you are pairing a new opener with an older door, we verify balance and spring condition first. An unbalanced door will destroy operators quickly no matter how premium the motor.`,
    ],
    imageSrc: '/images/305doors/services/openers-accessories.jpg',
    imageAlt:
      'Garage door opener installation with remote and keypad — 305 Doors Corp South Florida',
    sections: [
      {
        heading: 'Choosing belt, chain, or jackshaft',
        paragraphs: [
          `Belt-drive openers are popular for bedrooms-over-garage layouts because they run quieter than most chain units. Chain drives remain a durable choice for heavy wood doors and high-lift applications when noise is less of a concern. Jackshaft (wall-mount) operators mount beside the shaft and free ceiling space — ideal for low headroom, high lift, or cathedral garage ceilings common in newer South Florida builds.`,
          `We verify rail length, angle iron, and mounting integrity so the operator does not flex under load over time.`,
        ],
      },
      {
        heading: 'Smart home, Wi-Fi, and access control',
        paragraphs: [
          `App-based openers, third-party bridges, and keypad codes are convenient — but they must still meet reversal and entrapment protection requirements. We configure force, travel, and photo eyes correctly, then layer smart features on top.`,
          `For rental properties and HOAs, we can discuss restricted codes, vacation modes, and how to document access changes between tenants.`,
        ],
      },
      {
        heading: 'Repair: gears, belts, boards, and sensors',
        paragraphs: [
          `Grinding followed by motor run without travel often means stripped gears or a detached belt. Intermittent operation may trace to logic boards, capacitors, or RF interference. We diagnose before replacing the entire unit.`,
          `Photo eye misalignment, sun glare, and damaged wire staples are frequent “ghost” problems — we fix the root cause instead of repeatedly clearing error codes.`,
        ],
      },
      {
        heading: 'Replacement timing and upgrades',
        paragraphs: [
          `Most residential operators last roughly 10–15 years with normal use; heavy doors, poor balance, and constant cycling shorten life. When repair costs approach replacement, or when parts are obsolete, we recommend modern units with better safety features and often quieter operation.`,
        ],
      },
      {
        heading: 'Commercial operators and accessories',
        paragraphs: [
          `We install and service light- to medium-duty commercial operators where appropriate, including timer-to-close, loop detectors, and safety edges coordinated with your door type. Heavy industrial applications may require specialized vendors — we tell you upfront when a job is outside our wheelhouse.`,
        ],
      },
    ],
    bullets: [
      'Belt, chain, and jackshaft residential openers',
      'Remote, keypad, vehicle HomeLink, and app setup',
      'Safety sensor supply, alignment, and wiring repair',
      'Travel, force, and limit adjustment after door or spring changes',
      'Battery backup options where models support it',
      'Gear, belt, sprocket, and control board replacement when economical',
    ],
    faqs: [
      {
        question: 'How long do garage door openers last in Florida?',
        answer:
          'Many residential units last 10–15 years. Heat, humidity, and unbalanced doors can shorten life. We inspect the full system — springs, cables, and balance — not only the motor.',
      },
      {
        question: 'Can you add Wi-Fi to my existing opener?',
        answer:
          'Sometimes, with manufacturer-approved hubs or retrofit kits. When adapters are unreliable or the opener is already weak, a full replacement is often the better value.',
      },
      {
        question: 'Why does my opener light blink and the door not close?',
        answer:
          'That pattern usually indicates a safety sensor fault — alignment, wiring, or sun interference. We test eyes, voltage, and control logic to pinpoint it.',
      },
      {
        question: 'Do you install jackshaft openers on every door?',
        answer:
          'Only when shaft geometry, headroom, and manufacturer requirements allow. We confirm your door’s lift type and clearances before recommending wall-mount operators.',
      },
      {
        question: 'Is opener installation covered by warranty?',
        answer:
          'Manufacturer warranties apply to the operator; we explain labor coverage for our installation work and any extended terms in writing.',
      },
    ],
  },

  'hurricane-rated-garage-doors': {
    slug: 'hurricane-rated-garage-doors',
    pageTitle:
      'Hurricane Rated Garage Doors Florida | Wind Load & Impact Options | 305 Doors',
    navLabel: 'Hurricane-rated doors',
    metaDescription: `Hurricane-rated & wind-load garage doors for Florida homes. Code-aware installs, reinforced hardware, documentation for your records. South Florida-wide. ${PHONE_DISPLAY}.`,
    keywords: [
      'hurricane rated garage doors Florida',
      'wind load garage door Miami',
      'Florida building code garage door',
      'impact rated garage door installation',
      'reinforced garage door storm protection',
      'garage door wind rating Broward',
      'Miami-Dade garage door permit',
      'storm ready garage door replacement',
    ],
    heroHeadingBefore: 'Hurricane-rated & wind-load garage doors for ',
    heroHeadingAccent: 'Florida',
    lead: `Garage doors are one of the largest openings on a home — and in high-wind events, a failed door can compromise structure and interior pressure. 305 Doors Corp installs wind-rated sectional assemblies with the right track, reinforcement, and attachment strategy for your exposure, opening size, and local amendments. We work with homeowners, builders, and insurers’ documentation needs from Miami-Dade’s strict wind maps through Broward, Palm Beach, and coastal Monroe County.`,
    trustHeading: 'Storm protection done as a system',
    belowHeroParagraphs: [
      `A label on a panel is not enough. Rated performance depends on compatible track, jamb connections, reinforcement struts or posts, and correct operator settings. We install and document assemblies as integrated systems so you understand what was installed and why.`,
      `Lead times compress before named storms. If you are upgrading for peace of mind, earlier planning beats the August rush — we maintain supplier relationships to source in-stock options when custom orders stretch.`,
      `We do not promise insurance discounts; carriers and credits change. We do provide product and installation documentation many homeowners use in mitigation conversations.`,
    ],
    imageSrc: '/images/305doors/gallery/latest-work/latest-work-16.jpeg',
    imageAlt:
      'Wind-rated residential garage door installation in South Florida — reinforced sectional door for storm season by 305 Doors Corp',
    sections: [
      {
        heading: 'Wind pressure, exposure, and opening size',
        paragraphs: [
          `Required performance depends on design wind speed, exposure category (B, C, or D), mean roof height, and effective opening area. A door that passes in one inland ZIP may not be appropriate for a beachfront exposure — we use manufacturer wind charts and job-site measurements rather than guesswork.`,
          `If you have engineered plans or a specific pressure requirement, bring them; we can match assemblies documented to meet the note.`,
        ],
      },
      {
        heading: 'Impact-rated and glazed sectional doors',
        paragraphs: [
          `Full-view and glazed doors are popular in modern Florida architecture but must address projectile and pressure requirements for the project. We work with lines that offer rated glazing packages and reinforcements suited to coastal applications where applicable.`,
        ],
      },
      {
        heading: 'Retrofit vs. full replacement',
        paragraphs: [
          `Some older doors accept engineered retrofit kits; others are too worn or misaligned for cost-effective upgrades. We compare kit pricing, labor, warranty, and aesthetics with full replacement so you can choose confidently.`,
        ],
      },
      {
        heading: 'Seasonal demand and maintenance',
        paragraphs: [
          `After installation, periodic balance checks, hardware torque reviews, and track cleaning extend life — especially before storm season. We offer maintenance visits and can bundle them with opener service.`,
        ],
      },
      {
        heading: 'What we do not provide',
        paragraphs: [
          `We focus on garage doors and operators. For hurricane shutters on windows, engineered tie-down packages unrelated to the garage, or structural assessments beyond the door opening, your GC or specialist may be the right resource — we are happy to coordinate timing with them.`,
        ],
      },
    ],
    bullets: [
      'Wind-rated sectional doors for coastal and inland exposures',
      'Rated hardware, reinforcement, and track packages as specified',
      'Glazed and full-view options where impact packages apply',
      'Documentation of installed components for your files',
      'Honest retrofit vs. replace comparisons on older openings',
      'Six-county South Florida coverage including the Keys',
    ],
    faqs: [
      {
        question: 'Will a hurricane-rated garage door lower my insurance?',
        answer:
          'Maybe — discounts and mitigation credits vary by carrier and policy. We provide documentation many homeowners use in those conversations but cannot guarantee a specific premium change.',
      },
      {
        question: 'Do you install hurricane shutters instead of rated doors?',
        answer:
          'We specialize in garage doors and openers, not whole-house shutter systems. Your contractor or shutter company is the right call for window protection packages.',
      },
      {
        question: 'Can you meet a specific wind pressure from my engineer?',
        answer:
          'Often yes, when product literature supports the required pressures for your opening and exposure. Share the specification early so we can confirm a match before you order.',
      },
      {
        question: 'How far in advance should I order before hurricane season?',
        answer:
          'As early as practical. Manufacturers and freight back up when storms enter the Atlantic. Winter and spring installs usually see better selection and calmer schedules.',
      },
      {
        question: 'Is my garage door the weak link during a storm?',
        answer:
          'It can be. Large openings concentrate wind pressure. If your door is old, unbalanced, or non-rated for your exposure, an evaluation and upgrade plan may be worthwhile.',
      },
    ],
  },

  'commercial-garage-doors': {
    slug: 'commercial-garage-doors',
    pageTitle:
      'Commercial Garage Doors South Florida | Roll-Up, Sectional & Dock | 305 Doors Corp',
    navLabel: 'Commercial doors',
    metaDescription: `Commercial garage doors: steel roll-ups, sectional loading bays, high-cycle operators, gates. Warehouses, retail, marinas & flex space in South Florida. ${PHONE_DISPLAY}.`,
    keywords: [
      'commercial garage doors Miami',
      'roll up door installation South Florida',
      'commercial sectional garage door',
      'warehouse garage door repair',
      'loading dock door service Broward',
      'storefront roll up door Palm Beach',
      'industrial garage door opener',
      'high cycle garage door springs',
    ],
    heroHeadingBefore: 'Commercial garage doors & ',
    heroHeadingAccent: 'industrial bays',
    lead: `Daily truck traffic, tenant turnover, and salt-air corrosion punish doors built for twelve cycles a day — not fifty. 305 Doors Corp installs and repairs commercial sectional doors, steel and aluminum roll-ups, and operators sized for real usage in warehouses, flex bays, retail back doors, marinas, and mixed-use parking. We speak GC schedules, tenant coordination, and the reality of minimizing downtime when a bay fails during deliveries.`,
    trustHeading: 'Built for cycles, not cosmetic specs',
    belowHeroParagraphs: [
      `Residential-grade springs and openers fail quickly on a loading dock. We specify high-cycle springs, appropriate wire size, and operators with duty ratings that match how often your crew hits the button.`,
      `Safety edges, photo eyes, loop detectors, and timer-to-close settings must align with your traffic patterns and code expectations. We commission controls so trucks, pedestrians, and facility managers are not fighting the door every morning.`,
      `From Hialeah industrial parks to Palm Beach Gardens flex space and Naples logistics corridors, our routes cover the same six counties as our residential work — with project quotes for larger scopes.`,
    ],
    imageSrc: '/images/305doors/services/roll-up-doors.jpg',
    imageAlt:
      'Commercial steel roll-up garage doors installed for South Florida warehouses and retail bays — 305 Doors Corp',
    sections: [
      {
        heading: 'Rolling steel and aluminum roll-up doors',
        paragraphs: [
          `Roll-up slat doors conserve side room and hold up in tight urban bays. Insulated models help conditioned spaces; perforated or grille options balance security with visibility for retail. We install manual chain hoists, motor operators, and smart controls where specified.`,
          `Curtain wear, slat dents, and guide damage are common failure points — we assess whether curtain replacement, guide realignment, or full door replacement is the economic winner.`,
        ],
      },
      {
        heading: 'Sectional commercial doors',
        paragraphs: [
          `Sectional doors offer sealing, insulation, and window options suited to fire stations, automotive shops, and distribution bays. We handle torsion hardware, high-lift and vertical-lift track, and jackshaft operators when ceiling space is tight.`,
          `Panel impact and track misalignment from forklift strikes are routine service calls — we straighten or replace track, swap sections when available, and re-balance the assembly.`,
        ],
      },
      {
        heading: 'Operators, controls, and safety devices',
        paragraphs: [
          `Medium-duty jackshaft and trolley operators, three-phase options where available, and accessories like loop detectors and traffic lights integrate with how your facility moves vehicles. We coordinate with electricians on power and with your team on training.`,
        ],
      },
      {
        heading: 'Preventive maintenance and service agreements',
        paragraphs: [
          `High-cycle doors benefit from scheduled inspections: torque checks, lubrication appropriate to environment, wear surveys on cables and drums, and opener parameter review. Ask about maintenance frequency tailored to your cycle counts — quarterly for heavy docks, annual for light retail, and so on.`,
        ],
      },
      {
        heading: 'New construction and tenant improvements',
        paragraphs: [
          `We coordinate rough openings, embeds, and electrical rough-in with your GC so doors commission cleanly at inspection. Change orders for headroom surprises are expensive — we prefer dimension checks during framing.`,
        ],
      },
      {
        heading: 'Gates and adjacent access (where we overlap)',
        paragraphs: [
          `Some properties pair roll-up doors with slide or swing gates. While gate specialization varies by project, we often coordinate sequencing and access control alongside door work when scopes overlap — and we will refer you when a dedicated gate contractor is the better fit.`,
        ],
      },
    ],
    bullets: [
      'Insulated and non-insulated steel roll-up curtains',
      'Commercial sectional doors for docks, shops, and parking',
      'High-cycle torsion assemblies and cable systems',
      'Jackshaft and trolley operators sized for duty cycles',
      'Safety edges, photo eyes, loops, and timer-to-close setup',
      'Emergency service when bays cannot close or secure',
      'Preventive maintenance programs for busy facilities',
    ],
    faqs: [
      {
        question: 'Do you offer commercial maintenance agreements?',
        answer:
          'Yes for many facilities. We set visit frequency based on cycle counts, environment, and how critical each bay is to operations.',
      },
      {
        question: 'Can you match my existing commercial door brand?',
        answer:
          'Often yes. We work with major lines and can frequently source compatible slats, sections, or operators for older bays.',
      },
      {
        question: 'Do you repair roll-up doors hit by forklifts?',
        answer:
          'Yes — we assess curtain, barrel, and guide damage, then recommend repair vs. replacement based on safety and cost.',
      },
      {
        question: 'What counties do you cover for commercial work?',
        answer:
          'Miami-Dade, Broward, Palm Beach, Lee, Collier, and Monroe Counties. Larger regional projects outside daily routes may be quoted case by case.',
      },
      {
        question: 'Can you work after hours to avoid shutting down deliveries?',
        answer:
          'When scheduling allows, yes — discuss window preferences when you book so we can align crews with your dock calendar.',
      },
    ],
  },
}

/** Footer / cross-page navigation to dedicated service URLs */
export const SERVICE_NAV_LINKS = SERVICE_PAGE_SLUGS.map((slug) => ({
  href: `/services/${slug}/` as const,
  label: SERVICES[slug].navLabel,
}))

export function getServicePage(slug: string): ServicePageContent | null {
  if (!(SERVICE_PAGE_SLUGS as readonly string[]).includes(slug)) {
    return null
  }
  return SERVICES[slug as ServicePageSlug]
}

export function allServiceSlugs(): readonly ServicePageSlug[] {
  return SERVICE_PAGE_SLUGS
}

/** Full H1 text for accessibility and structured data helpers */
export function servicePageH1(content: ServicePageContent): string {
  return `${content.heroHeadingBefore}${content.heroHeadingAccent}`.replace(/\s+/g, ' ').trim()
}
