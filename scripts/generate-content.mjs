import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const t = (en, np = en) => ({ en, np });

const timelineRows = [
  ["m_20241214_added", "ch_beginning", "2024-12-14T21:19:00+05:45", "December 14, 2024 — 9:19 PM", "The first moment", "suruko moment", "We added each other.", "hami add bhayau.", "One small tap, one big beginning.", "sano click, thulo suru.", ["Firsts", "Destiny"], null, null],
  ["m_20241222_first_seen", "ch_beginning", "2024-12-22T00:00:00+05:45", "December 22, 2024", "First time we saw each other", "pahilo choti dekheko din", "The first real oh, it's you.", "pahilo real oh, timi.", "It felt like the start of a story.", "story ko suru jasto lagyo.", ["Firsts"], null, null],
  ["m_20241225_godawari", "ch_beginning", "2024-12-25T13:00:00+05:45", "December 25, 2024 — around 1 PM", "Godawari, just us", "Godawari, sirf hami", "Our first real alone moment.", "hamro pahilo real alone moment.", "No crowd, no noise, just us.", "na crowd, na noise, sirf hami.", ["Firsts", "Dates"], null, "/audio/godawari-note.mp3"],
  ["m_20250104_song", "ch_growing", "2025-01-04T00:00:00+05:45", "January 4, 2025", "My first song for my mutu", "mutu ko lagi pahilo geet", "I wrote a song for you.", "maile geet lekhe.", "I wanted to create for you.", "timro lagi create garna man lagyo.", ["Creative", "Love Language"], null, "/audio/first-song-snippet.mp3"],
  ["m_20250112_parking_destiny", "ch_growing", "2025-01-12T00:00:00+05:45", "January 12, 2025", "Destiny parking lot", "parking lot destiny", "We met again by accident.", "accidentally bhetiyau.", "Universe was being extra.", "universe extra thiyo.", ["Destiny", "Funny", "Firsts"], null, null],
  ["m_20250122_first_date", "ch_growing", "2025-01-22T00:00:00+05:45", "January 22, 2025", "Our first date", "hamro pahilo date", "Officially, us.", "officially, hami.", "Nervous, happy, safe.", "nervous, happy, safe.", ["Dates", "Firsts"], null, null],
  ["m_20250125_family_dinner", "ch_growing", "2025-01-25T00:00:00+05:45", "January 25, 2025", "Dinner with my family", "mero family sanga dinner", "My heart was full.", "mero mutu full bhayo.", "You belonged there.", "timi tei belong garyau.", ["Family", "Milestone"], null, null],
  ["m_20250126_birth_year", "ch_growing", "2025-01-26T00:00:00+05:45", "January 26, 2025", "Personal became personal-er", "personal level up", "You shared your birth year.", "timi le birth year bhanyau.", "Small detail, big trust.", "sano detail, thulo trust.", ["Trust", "Milestone"], null, null],
  ["m_20250201_poem", "ch_love_language", "2025-02-01T00:00:00+05:45", "February 1, 2025", "A small poem for my mutu", "mutu ko lagi poem", "I could not keep it inside.", "bhitra rakhnai sakina.", "Poetry said what I felt.", "poem le feeling bhanidiyo.", ["Creative", "Love Language"], null, null],
  ["m_20250214_iloveyou_voice", "ch_love_language", "2025-02-14T00:00:00+05:45", "February 14, 2025", "First I love you (voice)", "pahilo I love you awaaz", "My heart learned a new sound.", "mero mutu le naya awaaz sikyo.", "Soft, real, permanent.", "soft, real, permanent.", ["Firsts", "Love Language"], null, null],
  ["m_20250222_love_letter", "ch_love_language", "2025-02-22T00:00:00+05:45", "February 22, 2025", "Your love letter", "timro love letter", "I reread it in my head.", "feri feri padhchu.", "You built home with words.", "words le ghar banayau.", ["Love Language", "Milestone"], null, null],
  ["m_20250302_first_video_call", "ch_rituals", "2025-03-02T00:00:00+05:45", "March 2, 2025", "Our first video call", "pahilo video call", "Distance lost a little.", "distance alikati haryo.", "Us became daily.", "us daily bhayo.", ["Calls", "Firsts"], null, null],
  ["m_20250311_tika_video", "ch_rituals", "2025-03-11T00:00:00+05:45", "March 11, 2025", "First tika (video call)", "video call ma tika", "A blessing across distance.", "distance bhari blessing.", "Love with intention.", "intention wala maya.", ["Ritual", "Calls"], null, null],
  ["m_20250328_threatening_moment", "ch_rituals", "2025-03-28T00:00:00+05:45", "March 28, 2025", "The famous moment 😄", "famous moment 😄", "Only we know.", "sirf hami lai thaha.", "Forever coded.", "forever coded.", ["Funny", "Inside Joke"], null, null, true],
  ["m_20250415_sleep_on_call", "ch_rituals", "2025-04-15T00:00:00+05:45", "April 15, 2025", "Fell asleep on call", "call ma suteko raat", "Comfort, no words needed.", "comfort, words bina.", "Presence felt like home.", "presence le ghar jasto feel diyo.", ["Calls", "Comfort"], null, null],
  ["m_20250402_selfie", "ch_her_era", "2025-04-02T00:00:00+05:45", "April 2, 2025", "That beautiful selfie", "tyo beautiful selfie", "One of my favorite photos.", "mero favorite photo haru madhye ek.", "You trusted me with softness.", "timi le softness dekhayau.", ["Photos", "Milestone"], null, null],
  ["m_20250407_childhood_photo", "ch_her_era", "2025-04-07T00:00:00+05:45", "April 7, 2025", "Childhood photo unlock", "bachpan photo unlock", "Pure side revealed.", "pure side unlock.", "You shared your history.", "timi le history dekhayau.", ["Trust", "Photos"], null, null],
  ["m_20250425_first_gift", "ch_her_era", "2025-04-25T00:00:00+05:45", "April 25, 2025", "Your first gift to me", "timro pahilo gift", "My first gift from you.", "timro pahilo gift malai.", "The message was sweetest.", "message sab bhanda sweet.", ["Gifts", "Milestone"], null, null],
  ["m_20250427_makeup_photo", "ch_her_era", "2025-04-27T00:00:00+05:45", "April 27, 2025", "Makeup photo (saved forever)", "makeup photo (saved)", "I saved it, obviously.", "save ta garnai paryo.", "Too pretty to forget.", "birsina mildaina.", ["Photos", "Funny"], null, null],
  ["m_20250714_yellow_dress", "ch_her_era", "2025-07-14T00:00:00+05:45", "July 14, 2025", "The yellow dress day", "yellow dress din 💛", "Still in my memory.", "ajhai mind ma chha.", "Like a favorite chorus.", "favorite chorus jasto.", ["Photos", "Iconic"], null, null],
  ["m_20250801_kiss_voice_wana", "ch_her_era", "2025-08-01T00:00:00+05:45", "August 2025", "First kiss voice note, Wana", "pahilo kiss voice, wana", "A kiss in sound.", "awaaz ma kiss.", "Cute and bold.", "cute ra bold.", ["Inside Joke", "Love Language"], null, "/audio/wana-kiss.mp3", true],
  ["m_20250823_kiss_video_gesture", "ch_her_era", "2025-08-23T22:29:00+05:45", "August 23, 2025 — 10:29 PM", "First kiss video + gesture", "kiss video + gesture", "I watched it many times.", "dherai choti here.", "Felt closer through the screen.", "screen bata ni najik feel.", ["Inside Joke", "Calls", "Iconic"], null, null, true],
  ["m_20250914_chess", "ch_her_era", "2025-09-14T00:00:00+05:45", "September 14, 2025", "Our first virtual chess match", "pahilo virtual chess match", "I won. Proof is here 😄", "ma jite 😄", "History is history.", "history ta history.", ["Funny", "Games"], null, null],
  ["m_20251007_no_filter_snap", "ch_her_era", "2025-10-07T00:00:00+05:45", "October 7, 2025", "First no-filter snap", "no-filter snap", "Real face. Real you.", "real face. real timi.", "Honest intimacy.", "honest intimacy.", ["Trust", "Photos"], null, null],
  ["m_20251022_sari_video", "ch_her_era", "2025-10-22T00:00:00+05:45", "October 22, 2025", "Sari on video call", "video call ma sari", "I was speechless.", "ma speechless bhaye.", "Tradition and beauty in one frame.", "tradition ra beauty ekai frame.", ["Photos", "Iconic"], null, null],
  ["m_20251025_kitchen_bathroom_calls", "ch_rituals", "2025-10-25T00:00:00+05:45", "October 25, 2025", "Kitchen call and bathroom call", "kitchen + bathroom call", "No distance. No shyness.", "distance zero. shyness zero.", "Real life calls made love daily.", "real life call le maya daily banayo.", ["Calls", "Comfort", "Funny"], null, null],
  ["m_20251028_resigned_tuth", "ch_here_now", "2025-10-28T00:00:00+05:45", "October 28, 2025", "New chapter begins", "naya chapter suru", "You resigned from Teaching Hospital.", "Teaching Hospital bata resign.", "You are brave, and I am proud.", "timi brave chhau, ma proud chu.", ["Milestone", "Nurse Era"], null, "/audio/proud-of-you.mp3"],
  ["m_20251121_long_call", "ch_rituals", "2025-11-21T00:00:00+05:45", "November 21, 2025", "6 hours 58 minutes", "6 ghanta 58 minute", "Whole night. Whole heart.", "raat bhari. mutu bhari.", "Not time passing, love building.", "time passing hoina, maya building.", ["Calls", "Iconic"], null, null],
  ["m_20260114_flower_bhaisipati", "ch_here_now", "2026-01-14T00:00:00+05:45", "January 14, 2026", "A flower on the road", "road ma ful", "You gave me a flower.", "timi le malai ful diyau.", "Simple moment, big meaning.", "simple moment, thulo meaning.", ["Gifts", "HereNow"], null, null],
  ["m_20260115_skirt_first_time", "ch_here_now", "2026-01-15T00:00:00+05:45", "January 15, 2026", "That skirt moment", "skirt moment", "First time in front of me.", "pahilo choti malai dekhauna.", "Confident and cute together.", "confident ra cute ekai choti.", ["Iconic", "HereNow"], null, null],
  ["m_extra_kantara", "ch_extra", "2025-01-01T00:00:00+05:45", "Extra memory", "The first movie after we met", "pahilo movie after hami", "Kantara with Teaching Hospital friends.", "Kantara, Teaching Hospital sathi sanga.", "Small detail, big feeling.", "sano detail, thulo feeling.", ["Extra", "Nurse Era"], null, null]
];

const timelineItems = timelineRows.map((row) => {
  const [id, chapterId, dateISO, displayDate, enTitle, npTitle, enShort, npShort, enLong, npLong, tags, image, audio, locked] = row;
  const entry = {
    id,
    chapterId,
    dateISO,
    displayDate,
    title: t(enTitle, npTitle),
    short: t(enShort, npShort),
    long: t(enLong, npLong),
    tags,
    image,
    audio
  };
  if (locked) {
    return {
      ...entry,
      locked: true,
      unlock: {
        type: "vault",
        requires: "unlocks.vault=true"
      }
    };
  }
  return entry;
});

const content = {
  meta: {
    appId: "mutu-memoir",
    appName: t("Mutu Memoir", "Mutu Memoir (मुटु सम्झना)"),
    version: "1.0.0",
    timezone: "Asia/Kathmandu",
    localeDefault: "mixed",
    notes: t("Bilingual app content.", "bilingual app content.")
  },
  settings: {
    languageModeDefault: "mixed",
    moodDefault: "soft",
    reducedMotionDefault: "system",
    privacy: { noIndex: true, showAppTitlePublic: false }
  },
  gate: {
    enabled: true,
    title: t("Enter our code", "hamro code hala na 😄"),
    subtitle: t("This is private. Only for you, Reeja.", "yo private ho mutu, timrai lagi ❤️"),
    hint: t("Hint: our tiny signature word.", "hint: hamro cute signature word."),
    pinMode: "phrase",
    phraseOptions: ["wana", "mutu", "919"],
    errorMessage: t("Almost, try again my mutu 😄", "close, feri try gara mutu 😄"),
    successMessage: t("Unlocked ❤️", "khulyo ❤️")
  },
  cover: {
    title: t("For Reeja, my mutu.", "Reeja ko lagi, mero mutu ❤️"),
    subtitle: t("A small place where our memories live.", "hamro samjhana haru basne sano thau."),
    helper: t("Open this when you miss me.", "timro yaad aayo bhane, yaha aau ❤️"),
    ctaPrimary: t("Open it ❤️", "khola na ❤️"),
    ctaSecondary: t("Peek first", "sano preview 😄"),
    footer: t("Made by your person.", "timro manchhe le banayeko.")
  },
  milestones: [
    { id: "ms_added", label: t("We added each other", "hami add bhayau"), dateISO: "2024-12-14T21:19:00+05:45" },
    { id: "ms_godawari", label: t("Godawari, just us", "Godawari, sirf hami"), dateISO: "2024-12-25T13:00:00+05:45" },
    { id: "ms_first_date", label: t("First date", "pahilo date"), dateISO: "2025-01-22T00:00:00+05:45" },
    { id: "ms_ily", label: t("First I love you voice", "pahilo I love you awaaz"), dateISO: "2025-02-14T00:00:00+05:45" }
  ],
  steps: [
    { id: "step_cover", label: t("Open", "khola") },
    { id: "step_letter", label: t("Letter", "chitthi") },
    { id: "step_timeline", label: t("Relive", "samjha") },
    { id: "step_gallery", label: t("Gallery", "photo corner") },
    { id: "step_nurse", label: t("For my nurse", "mero nurse ko lagi") },
    { id: "step_play", label: t("Play", "khela") },
    { id: "step_promises", label: t("Promises", "bachan") },
    { id: "step_finale", label: t("Finale", "last") }
  ],
  letter: {
    title: t("A letter for you", "timro lagi ek chitthi"),
    variants: {
      soft: { body: t("Reeja, my mutu.\nWe became us in small moments.\nYou care for everyone, and I will always care for you.\nFrom 9:19 PM to Godawari to late calls, every quiet moment matters.\nHappy Valentine’s Day ❤️", "Reeja, mero mutu.\nHami sano sano moment bata us bhayau.\nTimi sablai care garchau, ma timilai always care garchu.\n9:19 PM dekhi Godawari samma, sab quiet moment special chha.\nHappy Valentine’s Day ❤️"), cta: t("Continue", "agadi jaau") },
      funny: { body: t("Welcome to the most serious app ever for the cutest person ever 😄\nRule 1: smile.\nRule 2: if no smile, I try harder.\nRule 3: never forget 9:19 PM.", "swagat chha serious app ma cutest person ko lagi 😄\nRule 1: smile.\nRule 2: smile chaina bhane ma feri try.\nRule 3: 9:19 PM birsina hudaina."), cta: t("Let's go", "jaam") },
      romantic: { body: t("My Reeja,\nI do not want perfect love, I want safe love.\nWith you, love feels calm and real.\nCome, let us relive us ❤️", "Mero Reeja,\nmalai perfect maya hoina, safe maya chahinchha.\nTimro saathma maya calm ra real lagchha.\nAau, hami feri hamilai samjhaun ❤️"), cta: t("Relive us", "hamilai samjha") }
    }
  },
  timeline: {
    title: t("Our Timeline", "hamro timeline (सम्झना)"),
    subtitle: t("Tap a memory to open it.", "memory tap gara, khulchha ❤️"),
    chapterOrder: ["ch_beginning", "ch_growing", "ch_love_language", "ch_rituals", "ch_her_era", "ch_here_now", "ch_extra"],
    chapters: [
      { id: "ch_beginning", title: t("The Beginning", "suruko din haru"), hint: t("Where everything started.", "jaha sabai suru bhayo.") },
      { id: "ch_growing", title: t("Growing Feelings", "maya badhdai gayo"), hint: t("Small moments became big.", "sano moment thulo bhayo.") },
      { id: "ch_love_language", title: t("Love Language", "maya ko bhasa"), hint: t("Poems and voice.", "poem ra awaaz.") },
      { id: "ch_rituals", title: t("Our Rituals", "hamro ritual"), hint: t("Calls and comfort.", "call ra comfort.") },
      { id: "ch_her_era", title: t("Her Era", "timro era"), hint: t("You being you.", "timi, timi nai.") },
      { id: "ch_here_now", title: t("Here & Now", "aile ko hamro"), hint: t("Recent moments.", "naya moment haru.") },
      { id: "ch_extra", title: t("Extra Memory", "extra samjhana"), hint: t("Small detail.", "sano detail.") }
    ],
    items: timelineItems
  },
  gallery: {
    title: t("Polaroid Gallery", "polaroid gallery (photo corner)"),
    subtitle: t("Snapshots I still replay in my head.", "photo haru, mind ma rent-free."),
    items: [
      { id: "g_yellow_dress", image: "/img/gallery/yellow-dress.jpg", dateISO: "2025-07-14T00:00:00+05:45", caption: t("Yellow dress day 💛", "yellow dress din 💛") },
      { id: "g_best_selfie", image: "/img/gallery/selfie-2025-04-02.jpg", dateISO: "2025-04-02T00:00:00+05:45", caption: t("That selfie I cannot forget", "birsina nasakne selfie") },
      { id: "g_sari_call", image: "/img/gallery/sari-call.jpg", dateISO: "2025-10-22T00:00:00+05:45", caption: t("Sari on video call ✨", "video call ma sari ✨") },
      { id: "g_flower_day", image: "/img/gallery/flower-2026-01-14.jpg", dateISO: "2026-01-14T00:00:00+05:45", caption: t("You gave me a flower", "timi le malai ful diyau") }
    ]
  },
  nurseAppreciation: {
    title: t("For my nurse", "mero nurse mutu ko lagi ❤️"),
    sections: [
      { id: "n1", heading: t("What I admire about you", "timi ma malai man parne kura"), body: t("You care all day and still make space for love.", "timi din bhari care garchau ani maya ko space ni banauchau.") },
      { id: "n2", heading: t("Rest mode (official)", "rest mode (official)"), body: t("You are allowed to rest right now, not later.", "timi ahile nai rest garna paauchau, pachi hoina.") },
      { id: "n3", heading: t("I am proud of you", "ma timro proud chu"), body: t("Your new chapter is brave and beautiful.", "timro naya chapter brave ra beautiful chha.") }
    ],
    audio: "/audio/nurse-appreciation.mp3"
  },
  play: {
    quiz: {
      title: t("Mutu Quiz", "Mutu Quiz 😄"),
      subtitle: t("No pressure. Just us.", "pressure chaina mutu, sirf hami."),
      questions: [
        { id: "q_919", type: "single", question: t("What time did we add each other for the first time?", "hami pahilo choti kati baje add bhayau?"), options: [t("8:19 PM", "8:19"), t("9:19 PM", "9:19"), t("10:19 PM", "10:19")], answerIndex: 1, feedbackCorrect: t("Correct. Sacred time ❤️", "correct. sacred time ❤️"), feedbackWrong: t("Close! I will remind you forever 😄", "close! ma yaad garaidinchhu 😄") },
        { id: "q_godawari", type: "single", question: t("Where was our first real alone moment?", "hamro pahilo real alone moment kaha thiyo?"), options: [t("Godawari"), t("Thamel"), t("Patan")], answerIndex: 0, feedbackCorrect: t("Yes. Godawari forever.", "ho. Godawari forever."), feedbackWrong: t("Aiyo! It was Godawari 😄", "aiyo! Godawari ho 😄") },
        { id: "q_parking", type: "single", question: t("Our destiny meet happened where?", "hamro destiny meet kaha bhayo?"), options: [t("Parking lot"), t("Bus stop"), t("Cafe")], answerIndex: 0, feedbackCorrect: t("Correct. Universe was extra 😄", "correct. universe extra 😄"), feedbackWrong: t("Nope, parking lot 😄", "nope, parking lot 😄") },
        { id: "q_movie", type: "single", question: t("First movie after we met?", "hami bhete pachi pahilo movie?"), options: [t("Kantara"), t("KGF"), t("RRR")], answerIndex: 0, feedbackCorrect: t("Yes, Kantara.", "ho, Kantara."), feedbackWrong: t("It was Kantara 😄", "Kantara ho 😄") },
        { id: "q_long_call", type: "single", question: t("How long was our whole-night call?", "hamro raat-bhari call kati time?"), options: [t("3h 20m", "3:20"), t("6h 58m", "6:58"), t("9h 10m", "9:10")], answerIndex: 1, feedbackCorrect: t("Correct. That is home.", "correct. yo ghar ho."), feedbackWrong: t("Close! 6h 58m ❤️", "close! 6 ghanta 58 minute ❤️") }
      ]
    },
    memoryMatch: {
      title: t("Memory Match", "Memory Match 😄"),
      subtitle: t("Match date and moment.", "date ra moment match gara."),
      pairSource: "timeline.items",
      pairCount: 8,
      endMessage: t("Perfect match ❤️", "perfect match ❤️")
    }
  },
  promises: {
    title: t("Promises & Coupons", "Promises & Coupons (बचन)"),
    subtitle: t("Redeem anytime. Love has no expiry.", "jaba man lagchha use gara. maya ko expiry hudaina."),
    filters: [{ id: "all", label: t("All", "sab") }, { id: "unlocked", label: t("Unlocked", "khuleko") }, { id: "redeemed", label: t("Redeemed", "use bhayeko") }],
    ctaRedeem: t("Redeem", "use gara"),
    ctaUndo: t("Undo", "farkau"),
    items: [
      { id: "c_nurse_rescue", rarity: "Legendary", icon: "🩺", title: t("Nurse fatigue rescue day", "nurse thakai remove day"), desc: t("You rest. I handle everything.", "timi rest. ma sabai handle garxu.") },
      { id: "c_listen_first", rarity: "Rare", icon: "👂", title: t("I will listen first pass", "pahila sunxu pass"), desc: t("No fixing, just listening.", "fixing chaina, sirf sunne.") },
      { id: "c_date_planned_by_me", rarity: "Rare", icon: "📅", title: t("Date planned fully by me", "date ma plan garxu"), desc: t("You show up, I plan all.", "timi aau, plan ma garxu.") },
      { id: "c_godawari_repeat", rarity: "Legendary", icon: "🌿", title: t("Godawari part-2", "Godawari part-2"), desc: t("We make a new memory there.", "tei ma naya memory banauchau.") },
      { id: "c_momo_movie", rarity: "Common", icon: "🥟", title: t("Momo + movie night", "momo + movie night"), desc: t("Your movie choice, my momo duty.", "movie timro, momo mero.") },
      { id: "c_phone_free_walk", rarity: "Common", icon: "🚶", title: t("Phone-free walk", "phone bina walk"), desc: t("No scrolling, just us.", "scroll chaina, sirf hami.") },
      { id: "c_boring_task", rarity: "Common", icon: "🧾", title: t("I do the boring task", "boring kaam ma garxu"), desc: t("Paperwork and errands, mine.", "paperwork ra errands, mero.") },
      { id: "c_poem_again", rarity: "Rare", icon: "📝", title: t("Write you a poem again", "feri poem lekhdinchhu"), desc: t("Fresh poem for you.", "timrai lagi naya poem.") },
      { id: "c_talk_till_sleep", rarity: "Legendary", icon: "🌙", title: t("Talk till sleep night", "sutunjel call night"), desc: t("No rush, just us till sleep.", "rush chaina, sutunjel hami.") }
    ]
  },
  finale: {
    title: t("Choose your ending", "ending choose gara mutu"),
    choices: [{ id: "soft", label: t("Soft") }, { id: "funny", label: t("Funny") }, { id: "romantic", label: t("Emotional", "emotional") }],
    variants: {
      soft: { headline: t("Happy Valentine’s Day, Reeja.", "Happy Valentine’s Day, mero mutu ❤️"), body: t("Thank you for choosing me again and again.\nWith you, love feels safe.\nNow come here ❤️", "dhanyabad, malai feri feri choose gareko lagi.\nTimro saathma maya safe lagchha.\naba yeta aau ❤️"), ctaPrimary: t("Replay our story", "feri heram"), ctaSecondary: t("Open the secret", "secret khola") },
      funny: { headline: t("Serious announcement 😄", "serious announcement 😄"), body: t("You are officially my favorite human.\nComplaints not accepted 😄\nI love you, a lot.", "timi officially mero favorite human.\ncomplaints accept hudaina 😄\nma timilai dherai maya garchu."), ctaPrimary: t("Replay", "feri"), ctaSecondary: t("Unlock vault", "vault khola") },
      romantic: { headline: t("My Reeja, my home.", "Mero Reeja, mero ghar."), body: t("If I had one word for you, it is home.\nNot place, feeling.\nStay with me, always ❤️", "timi lai describe garna ek word, home.\nplace hoina, feeling.\nma sanga basa, always ❤️"), ctaPrimary: t("Replay our story", "feri heram"), ctaSecondary: t("Write back to me", "malai lekha") }
    }
  },
  vault: {
    title: t("Inside Joke Vault", "inside joke vault 😄"),
    subtitle: t("Only for us. Coded forever.", "sirf hami lai. forever coded."),
    unlock: { type: "tapSequence", target: "heart", count: 7, successMessage: t("Unlocked 😄", "khulyo 😄") },
    items: [
      { id: "v_threatening", title: t("The famous moment", "famous threatening moment 😄"), body: t("Only we know. Smile and change topic.", "sirf hami lai thaha. smile gara, topic change.") },
      { id: "v_wana", title: t("Wana"), body: t("Tiny word, huge feeling.", "sano word, thulo feeling.") },
      { id: "v_bathroom_call", title: t("Bathroom call day", "bathroom call din 😄"), body: t("Real life, no filter, pure love.", "real life, no filter, pure maya.") }
    ]
  },
  futureTimeline: {
    title: t("Future Us", "future hami"),
    subtitle: t("Locked memories waiting to happen.", "huna baki memory haru (locked)."),
    items: [
      { id: "f_first_trip", locked: true, unlock: { type: "date", dateISO: "2026-12-14T00:00:00+05:45" }, title: t("Our next big trip", "hamro next big trip"), short: t("To be written by us.", "hami le lekhnai baki.") },
      { id: "f_anniversary", locked: true, unlock: { type: "date", dateISO: "2026-12-14T00:00:00+05:45" }, title: t("First anniversary", "pahilo anniversary"), short: t("One year since 9:19 PM.", "9:19 PM dekhi ek barsa.") },
      { id: "f_new_home", locked: true, unlock: { type: "passcode", codeHint: "A word we say when we miss each other." }, title: t("Our home chapter", "hamro ghar chapter"), short: t("Coming soon ❤️", "coming soon ❤️") }
    ]
  },
  writeBack: {
    title: t("Write back to me", "malai lekha mutu"),
    subtitle: t("Private note. Saved only on this device.", "private note. yo device ma matrai save huncha."),
    placeholders: t("Write anything you want me to remember...", "malai yaad garauna chahane kehi ni lekha..."),
    ctaSave: t("Save", "save gara"),
    ctaClear: t("Clear", "clear"),
    savedToast: t("Saved ❤️", "save bhayo ❤️")
  }
};

const outputPath = resolve("src/content/content.json");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(content, null, 2));
console.log(`Generated ${outputPath}`);
