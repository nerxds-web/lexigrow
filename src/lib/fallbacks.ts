import { GeminiWordResult, ProficiencyLevel } from "../types";

export const FALLBACK_VOCABULARY: Record<
  'english' | 'german',
  Record<ProficiencyLevel, GeminiWordResult[]>
> = {
  english: {
    A1: [
      {
        word: "friend",
        meaningEn: "A person whom one knows and with whom one has a bond of mutual affection.",
        meaningAr: "صديق - شخص تربطك به علاقة مودة ومحبة متبادلة.",
        example: "She is a very good friend of mine.",
        exampleAr: "إنها صديقة مقربة جداً لي.",
        partOfSpeech: "noun",
        ipa: "/frɛnd/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "house",
        meaningEn: "A building for human habitation, especially one that is lived in by a family.",
        meaningAr: "منزل - مبنى مخصص لسكن البشر.",
        example: "They live in a beautiful white house.",
        exampleAr: "إنهم يعيشون في منزل أبيض جميل.",
        partOfSpeech: "noun",
        ipa: "/haʊs/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "water",
        meaningEn: "A colorless, transparent, odorless liquid that forms the seas, lakes, and rain.",
        meaningAr: "ماء - سائل شفاف عديم اللون والرائحة يملأ البحار والبحيرات.",
        example: "Please drink a glass of water.",
        exampleAr: "من فضلك اشرب كوباً من الماء.",
        partOfSpeech: "noun",
        ipa: "/ˈwɔːtər/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "school",
        meaningEn: "An institution for educating children.",
        meaningAr: "مدرسة - مؤسسة مخصصة لتعليم الأطفال.",
        example: "The children walk to school every morning.",
        exampleAr: "يمشي الأطفال إلى المدرسة كل صباح.",
        partOfSpeech: "noun",
        ipa: "/skuːl/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "happy",
        meaningEn: "Feeling or showing pleasure or contentment.",
        meaningAr: "سعيد - الشعور بالسرور والرضا.",
        example: "Meeting new friends makes me very happy.",
        exampleAr: "لقاء أصدقاء جدد يجعلني سعيداً جداً.",
        partOfSpeech: "adjective",
        ipa: "/ˈhæpi/",
        language: "english",
        genderArticle: ""
      }
    ],
    A2: [
      {
        word: "journey",
        meaningEn: "An act of traveling from one place to another.",
        meaningAr: "رحلة - الانتقال من مكان إلى آخر.",
        example: "The train journey takes about three hours.",
        exampleAr: "تستغرق رحلة القطار حوالي ثلاث ساعات.",
        partOfSpeech: "noun",
        ipa: "/ˈdʒɜːni/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "weather",
        meaningEn: "The state of the atmosphere at a place and time as regards heat, dryness, sunshine, wind, rain, etc.",
        meaningAr: "الطقس - حالة الغلاف الجوي من حيث الحرارة، والجفاف، والرياح، والمطر.",
        example: "What is the weather like today?",
        exampleAr: "كيف يبدو الطقس اليوم؟",
        partOfSpeech: "noun",
        ipa: "/ˈwɛðər/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "kitchen",
        meaningEn: "A room or area where food is prepared and cooked.",
        meaningAr: "مطبخ - غرفة أو مساحة يتم فيها إعداد وطهي الطعام.",
        example: "My mother is baking a delicious cake in the kitchen.",
        exampleAr: "تخبز أمي كعكة لذيذة في المطبخ.",
        partOfSpeech: "noun",
        ipa: "/ˈkɪtʃɪn/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "market",
        meaningEn: "A regular gathering of people for the purchase and sale of provisions, livestock, and other goods.",
        meaningAr: "سوق - تجمع منتظم لشراء وبيع السلع والمواد الغذائية.",
        example: "We buy fresh vegetables at the local market every Sunday.",
        exampleAr: "نشتري الخضار الطازج من السوق المحلي كل أحد.",
        partOfSpeech: "noun",
        ipa: "/ˈmɑːkɪt/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "beautiful",
        meaningEn: "Pleasing the senses or mind aesthetically.",
        meaningAr: "جميل - يسر الحواس والذهن من الناحية الجمالية.",
        example: "They took pictures of the beautiful sunset.",
        exampleAr: "التقطوا صوراً لغروب الشمس الجميل.",
        partOfSpeech: "adjective",
        ipa: "/ˈbjuːtɪfʊl/",
        language: "english",
        genderArticle: ""
      }
    ],
    B1: [
      {
        word: "believe",
        meaningEn: "Accept that a statement is true or that someone is telling the truth.",
        meaningAr: "يصدق / يعتقد - قبول صحة قول ما أو صدق شخص ما.",
        example: "You must believe in your abilities to succeed.",
        exampleAr: "يجب أن تؤمن بقدراتك لكي تنجح.",
        partOfSpeech: "verb",
        ipa: "/bɪˈliːv/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "challenge",
        meaningEn: "A task or situation that tests someone's abilities or resources.",
        meaningAr: "تحدٍّ - مهمة أو وضع يختبر قدرات الشخص أو موارده.",
        example: "Learning a new language is a great challenge.",
        exampleAr: "تعلم لغة جديدة يمثل تحدياً رائعاً.",
        partOfSpeech: "noun",
        ipa: "/ˈtʃælɪndʒ/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "discover",
        meaningEn: "Find unexpectedly or during a search.",
        meaningAr: "يكتشف - العثور على شيء بشكل غير متوقع أو أثناء البحث.",
        example: "Scientists hope to discover a cure for the disease soon.",
        exampleAr: "يأمل العلماء في اكتشاف علاج للمرض قريباً.",
        partOfSpeech: "verb",
        ipa: "/dɪˈskʌvər/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "improve",
        meaningEn: "Make or become better.",
        meaningAr: "يُحسّن / يتطور - جعل الشيء أفضل أو جعل المرء يصبح أفضل.",
        example: "I practice English daily to improve my accent.",
        exampleAr: "أتدرب على اللغة الإنجليزية يومياً لأحسن من لهجتي.",
        partOfSpeech: "verb",
        ipa: "/ɪmˈpruːv/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "prepare",
        meaningEn: "Make something ready for use or consideration.",
        meaningAr: "يُحضّر / يستعد - إعداد شيء ما للاستخدام أو الدراسة.",
        example: "The class is preparing for their final examination.",
        exampleAr: "يستعد الصف لاختباراتهم النهائية.",
        partOfSpeech: "verb",
        ipa: "/prɪˈpɛər/",
        language: "english",
        genderArticle: ""
      }
    ],
    B2: [
      {
        word: "advantage",
        meaningEn: "A condition or circumstance that puts one in a favorable or superior position.",
        meaningAr: "ميزة/أفضلية - حالة تضع الفرد في موضع تفضيل أو تفوق.",
        example: "Fluency in German is a major advantage during job searches.",
        exampleAr: "طلاقة التحدث بالألمانية تعد ميزة كبرى عند البحث عن عمل.",
        partOfSpeech: "noun",
        ipa: "/ədˈvɑːntɪdʒ/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "analyze",
        meaningEn: "Examine methodically and in detail the constitution or structure of something.",
        meaningAr: "يُحلل - فحص بنية أو تركيب شيء ما بدقة ومنهجية.",
        example: "We need to analyze the feedback from our users.",
        exampleAr: "نحن بحاجة إلى تحليل التعليقات والآراء الواردة من مستخدمينا.",
        partOfSpeech: "verb",
        ipa: "/ˈænəlaɪz/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "consequence",
        meaningEn: "A result or effect of an action or condition.",
        meaningAr: "عاقبة/نتيجة - الأثر المترتب على فعل أو ظرف معين.",
        example: "You must accept the consequences of your decisions.",
        exampleAr: "يجب أن تتقبل عواقب قراراتك.",
        partOfSpeech: "noun",
        ipa: "/ˈkɒnsɪkwəns/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "influence",
        meaningEn: "The capacity to have an effect on the character, development, or behavior of someone or something.",
        meaningAr: "تأثير - القدرة على إحداث أثر في شخصية شخص ما أو سلوكه أو تطوره.",
        example: "Her parents had a huge influence on her career path.",
        exampleAr: "كان لوالديها تأثير هائل على مسار حياتها المهنية.",
        partOfSpeech: "noun",
        ipa: "/ˈɪnflʊəns/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "magnificent",
        meaningEn: "Extremely beautiful, elaborate, or impressive.",
        meaningAr: "رائع/مبهر - ذو جمال فائق أو مظهر يولد الإعجاب الشديد.",
        example: "The museum offers a magnificent view of the entire city.",
        exampleAr: "يوفر المتحف إطلالة رائعة على المدينة بأكملها.",
        partOfSpeech: "adjective",
        ipa: "/mæɡˈnɪfɪsənt/",
        language: "english",
        genderArticle: ""
      }
    ],
    C1: [
      {
        word: "aesthetic",
        meaningEn: "Concerned with beauty or the appreciation of beauty.",
        meaningAr: "جمالي - ما يتعلق بالجمال أو تقديره الفني والذوقي.",
        example: "The database UI design was driven by a modern, minimal aesthetic.",
        exampleAr: "كان تصميم واجهة المستخدم لقاعدة البيانات مدفوعاً بجمالية حديثة وبسيطة.",
        partOfSpeech: "adjective",
        ipa: "/iːsˈθɛtɪk/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "chronological",
        meaningEn: "Starting with the earliest and following the order in which they occurred.",
        meaningAr: "تسلسلي زمني - الترتيب بحسب أسبقية الحدوث تاريخياً.",
        example: "Please list your career experiences in chronological order.",
        exampleAr: "يرجى إدراج خبراتك المهنية في ترتيبها الزمني.",
        partOfSpeech: "adjective",
        ipa: "/ˌkrɒnəˈlɒdʒɪkəl/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "eloquence",
        meaningEn: "Fluent or persuasive speaking or writing.",
        meaningAr: "بلاغة / فصاحة - القدرة على كتابة أو التحدث بطلاقة وإقناع.",
        example: "The speaker captivated the audience with supreme eloquence.",
        exampleAr: "أسر المتحدث الجمهور بفصاحته الفائقة.",
        partOfSpeech: "noun",
        ipa: "/ˈɛləkwəns/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "pragmatic",
        meaningEn: "Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.",
        meaningAr: "ذرائعي / عملي - التعامل مع الأمور بواقعية وعقلانية مستندة إلى الجانب التطبيقي.",
        example: "We decided to take a pragmatic route to resolve the software issue.",
        exampleAr: "قررنا اتباع مسار عملي لحل مشكلة البرمجيات.",
        partOfSpeech: "adjective",
        ipa: "/præɡˈmætɪk/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "substantial",
        meaningEn: "Of considerable importance, size, or worth.",
        meaningAr: "هام / جوهري / ذو قيمة - كبير الحجم والأثر أو ذو قيمة عالية.",
        example: "They made a substantial effort to support the study group.",
        exampleAr: "بذلوا جهداً جوهرياً لدعم المجموعة الدراسية.",
        partOfSpeech: "adjective",
        ipa: "/səbˈstænʃəl/",
        language: "english",
        genderArticle: ""
      }
    ],
    C2: [
      {
        word: "cognizant",
        meaningEn: "Having knowledge or being aware of something.",
        meaningAr: "مدرك / واعٍ - الإلمام التام والوعي المحيط بأمر ما.",
        example: "The managers are fully cognizant of the legal risks involved.",
        exampleAr: "المدراء مدركون تماماً للمخاطر القانونية المترتبة.",
        partOfSpeech: "adjective",
        ipa: "/ˈkɒɡnɪzənt/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "ephemeral",
        meaningEn: "Lasting for a very short time.",
        meaningAr: "زائل / عابر - ما يستمر لفترة قصيرة جداً ويرحل.",
        example: "The beauty of digital art is often ephemeral.",
        exampleAr: "جمال الفن الرقمي غالباً ما يكون عابراً.",
        partOfSpeech: "adjective",
        ipa: "/ɪˈfɛmərəl/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "meticulous",
        meaningEn: "Showing great attention to detail; very careful and precise.",
        meaningAr: "دقيق للغاية / حذر - متميز بعناية فائقة للتفاصيل والدقة متناهية الإتقان.",
        example: "The designer maintained meticulous layout spacing on mobile views.",
        exampleAr: "حافظ المصمم على دقة متناهية في هوامش التصميم على شاشات المحمول.",
        partOfSpeech: "adjective",
        ipa: "/mɪˈtɪkjʊləs/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "paradigm",
        meaningEn: "A typical example or pattern of something; a model.",
        meaningAr: "نموذج فكري / نموذج مثالي - نمط أو مثال معياري معتمد.",
        example: "This new framework represents an architectural paradigm shift.",
        exampleAr: "تمثل بنية العمل الجديدة هذه نقلة نوعية في النموذج الهيكلي.",
        partOfSpeech: "noun",
        ipa: "/ˈpærədaɪm/",
        language: "english",
        genderArticle: ""
      },
      {
        word: "quintessential",
        meaningEn: "Representing the most perfect or typical example of a quality or class.",
        meaningAr: "جوهري / نموذجي متميز - يمثل المثال الأكمل والأنقى لصفة أو فئة.",
        example: "This is the quintessential Swiss modern display typography.",
        exampleAr: "إن هذا هو المثال الجوهري لنمط خطوط العرض السويسرية الحديثة.",
        partOfSpeech: "adjective",
        ipa: "/ˌkwɪntɪˈsɛnʃəl/",
        language: "english",
        genderArticle: ""
      }
    ]
  },
  german: {
    A1: [
      {
        word: "Freund",
        meaningEn: "A male friend; companion.",
        meaningAr: "صديق - شخص مقرب تربطك به علاقة صداقة.",
        example: "Er ist ein sehr treuer Freund.",
        exampleAr: "إنه صديق وفيّ للغاية.",
        partOfSpeech: "noun",
        ipa: "/frɔɪnd/",
        language: "german",
        genderArticle: "der"
      },
      {
        word: "Katze",
        meaningEn: "Cat; a small domesticated carnivorous mammal.",
        meaningAr: "قطة - حيوان أليف صغير من الثدييات.",
        example: "Die Katze schläft friedlich auf dem Stuhl.",
        exampleAr: "تنام القطة بسلام على الكرسي.",
        partOfSpeech: "noun",
        ipa: "/ˈkatsə/",
        language: "german",
        genderArticle: "die"
      },
      {
        word: "Buch",
        meaningEn: "Book; a written or printed work consisting of pages bound together.",
        meaningAr: "كتاب - مصنف مكتوب أو مطبوع يتألف من صفحات مجلدة معاً.",
        example: "Ich lese jeden Abend ein deutsches Buch.",
        exampleAr: "أنا أقرأ كتاباً ألمانياً كل مساء.",
        partOfSpeech: "noun",
        ipa: "/buːx/",
        language: "german",
        genderArticle: "das"
      },
      {
        word: "Wasser",
        meaningEn: "Water; transparent, odorless fluid.",
        meaningAr: "ماء - السائل الأساسي الشفاف والحيوي.",
        example: "Kann ich bitte ein Glas Wasser bekommen?",
        exampleAr: "هل يمكنني الحصول على كوب ماء من فضلك؟",
        partOfSpeech: "noun",
        ipa: "/ˈvasɐ/",
        language: "german",
        genderArticle: "das"
      },
      {
        word: "Schule",
        meaningEn: "School; an educational institution.",
        meaningAr: "مدرسة - مؤسسة مخصصة لطلاب المرحلة الأساسية والتكميلية.",
        example: "Meine Kinder gehen heute nicht zur Schule.",
        exampleAr: "أطفالي لن يذهبوا إلى المدرسة اليوم.",
        partOfSpeech: "noun",
        ipa: "/ˈʃuːlə/",
        language: "german",
        genderArticle: "die"
      }
    ],
    A2: [
      {
        word: "Frühstück",
        meaningEn: "Breakfast; the first meal of the day.",
        meaningAr: "فطور - الوجبة الأولى في الصباح بعد الاستيقاظ.",
        example: "Sie trinken Kaffee zum Frühstück.",
        exampleAr: "هم يشربون القهوة في وجبة الفطور.",
        partOfSpeech: "noun",
        ipa: "/ˈfryːʃtʏk/",
        language: "german",
        genderArticle: "das"
      },
      {
        word: "Reise",
        meaningEn: "Journey; trip or travel from one place to another.",
        meaningAr: "رحلة - السفر من بلد أو مدينة إلى أخرى.",
        example: "Gute Reise und viel Spaß in Berlin!",
        exampleAr: "رحلة سعيدة واستمتع بوقتك في برلين!",
        partOfSpeech: "noun",
        ipa: "/ˈraɪzə/",
        language: "german",
        genderArticle: "die"
      },
      {
        word: "Wetter",
        meaningEn: "Weather; external atmospheric conditions.",
        meaningAr: "طقس - الحالة الجوية الخارجية والحرارة والرياح.",
        example: "Das Wetter ist heute wunderbar sonnig.",
        exampleAr: "الطقس مشمس ورائع للغاية اليوم.",
        partOfSpeech: "noun",
        ipa: "/ˈvɛtɐ/",
        language: "german",
        genderArticle: "das"
      },
      {
        word: "Bahnhof",
        meaningEn: "Railway station; a place where trains start or stop.",
        meaningAr: "محطة قطار - المكان المخصص لوقوف وانطلاق القطارات.",
        example: "Der Expresszug wartet bereits am Bahnhof.",
        exampleAr: "ينتظر القطار السريع بالفعل في المحطة.",
        partOfSpeech: "noun",
        ipa: "/ˈbaːnˌhoːf/",
        language: "german",
        genderArticle: "der"
      },
      {
        word: "Schlüssel",
        meaningEn: "Key; tool used to open locks.",
        meaningAr: "مفتاح - أداة تستخدم لفتح وإغلاق الأقفال والأبواب.",
        example: "Hast du den Schlüssel zum Auto gesehen?",
        exampleAr: "هل رأيت مفتاح السيارة؟",
        partOfSpeech: "noun",
        ipa: "/ˈʃlʏsəl/",
        language: "german",
        genderArticle: "der"
      }
    ],
    B1: [
      {
        word: "Erfahrung",
        meaningEn: "Experience; knowledge gained over time through action.",
        meaningAr: "خبرة / تجربة - المعرفة المتراكمة نتيجة التجريب والممارسة.",
        example: "Besuch im Ausland bringt wertvolle Erfahrung.",
        exampleAr: "الزيارة إلى الخارج تجلب خبرة قيمة ونادرة.",
        partOfSpeech: "noun",
        ipa: "/ɛɐ̯ˈfaːʁʊŋ/",
        language: "german",
        genderArticle: "die"
      },
      {
        word: "Entscheidung",
        meaningEn: "Decision; choice made after consideration.",
        meaningAr: "قرار - الخيار النهائي المتخذ بعد تفكير وتمحيص.",
        example: "Wir müssen heute eine endgültige Entscheidung treffen.",
        exampleAr: "يجب علينا اتخاذ قرار نهائي اليوم.",
        partOfSpeech: "noun",
        ipa: "/ɛntˈʃaɪ̯dʊŋ/",
        language: "german",
        genderArticle: "die"
      },
      {
        word: "Erfolg",
        meaningEn: "Success; accomplishment of an aim or purpose.",
        meaningAr: "نجاح - تحقيق الهدف المرجو والتميز في الإنجاز.",
        example: "Ihr neues Sprachprojekt hat großen Erfolg.",
        exampleAr: "حقّق مشروعها اللغوي الجديد نجاحاً باهراً.",
        partOfSpeech: "noun",
        ipa: "/ɛɐ̯ˈfɔlk/",
        language: "german",
        genderArticle: "der"
      },
      {
        word: "Zukunft",
        meaningEn: "Future; period of time matching what is to come.",
        meaningAr: "مستقبل - الحقبة الزمنية القادمة وما يخبئه الغد.",
        example: "Niemand weiß, wie die Sprache der Zukunft klingt.",
        exampleAr: "لا أحد يعرف كيف ستبدو لغة المستقبل.",
        partOfSpeech: "noun",
        ipa: "/ˈt͡suːkʊnft/",
        language: "german",
        genderArticle: "die"
      },
      {
        word: "Verständnis",
        meaningEn: "Understanding; comprehension of something.",
        meaningAr: "تفاهم / فهم - الاستيعاب العميق لمعنى أو شعور ما.",
        example: "Ihr Lehrer zeigte großes Verständnis für das Problem.",
        exampleAr: "أظهر معلمها تفهماً واسعاً للمشكلة.",
        partOfSpeech: "noun",
        ipa: "/fɛɐ̯ˈʃtɛntnɪs/",
        language: "german",
        genderArticle: "das"
      }
    ],
    B2: [
      {
        word: "Herausforderung",
        meaningEn: "Challenge; testing task that requires maximum effort.",
        meaningAr: "تحدٍّ - مهمة مثيرة تختبر حدود وإمكانية المرء.",
        example: "Die Grammatik ist oft die größte Herausforderung für Lerner.",
        exampleAr: "القواعد غالباً ما تكون التحدي الأكبر لمتعلمي اللغة.",
        partOfSpeech: "noun",
        ipa: "/hɛˈʁaʊ̯sfɔʁdəʁʊŋ/",
        language: "german",
        genderArticle: "die"
      },
      {
        word: "Beziehung",
        meaningEn: "Relationship; link or connection between people.",
        meaningAr: "علاقة - تواصل أو ترابط وثيق بين شخصين أو طرفين.",
        example: "Eine gute Beziehung basiert auf gegenseitigem Vertrauen.",
        exampleAr: "تقوم العلاقة الجيدة على أساس الثقة المتبادلة بين الطرفين.",
        partOfSpeech: "noun",
        ipa: "/bəˈt͡siːʊŋ/",
        language: "german",
        genderArticle: "die"
      },
      {
        word: "Verantwortung",
        meaningEn: "Responsibility; duty to take charge and answer for actions.",
        meaningAr: "مسؤولية - الواجب الملقى على عاتق المرء وتحمل التزاماته.",
        example: "Eltern tragen eine große Verantwortung für ihre Kinder.",
        exampleAr: "يتحمل الآباء مسؤولية عظيمة تجاه رعاية وتنشئة أطفالهم.",
        partOfSpeech: "noun",
        ipa: "/fɛɐ̯ˈantvɔʁtʊŋ/",
        language: "german",
        genderArticle: "die"
      },
      {
        word: "Auswirkung",
        meaningEn: "Impact or consequence; effect.",
        meaningAr: "تأثير / انعكاس - الأثر الناتج عن قرار أو واقعة.",
        example: "Die wirtschaftlichen Auswirkungen sind weltweit spürbar.",
        exampleAr: "الآثار وانعكاساتها الاقتصادية باتت ملموسة عالمياً.",
        partOfSpeech: "noun",
        ipa: "/ˈaʊ̯svɪʁkʊŋ/",
        language: "german",
        genderArticle: "die"
      },
      {
        word: "Entwicklung",
        meaningEn: "Development; process of growth and refinement.",
        meaningAr: "تطوير / تنمية - عملية الارتقاء والنمو المنظم لشيء ما.",
        example: "Die Entwicklung der Technologie verläuft extrem rasant.",
        exampleAr: "يسير تطور التقنية وتنميتها بوتيرة صاعقة وسريعة للغاية.",
        partOfSpeech: "noun",
        ipa: "/ɛntˈvɪklʊŋ/",
        language: "german",
        genderArticle: "die"
      }
    ],
    C1: [
      {
        word: "Zusammenhang",
        meaningEn: "Context or connection; coherence.",
        meaningAr: "سياق / ترابط - العلاقة العميقة والمنطقية التي تجمع شيئين.",
        example: "In diesem Zusammenhang müssen wir auch die Kultur betrachten.",
        exampleAr: "في هذا السياق والترابط، يتوجب علينا أيضاً دراسة الجانب الثقافي.",
        partOfSpeech: "noun",
        ipa: "/t͡suˈzamənˌhaŋ/",
        language: "german",
        genderArticle: "der"
      },
      {
        word: "Gegenwart",
        meaningEn: "Present time; current moment.",
        meaningAr: "الحاضر - الفترة الحالية التي نعيشها الآن ولا تشمل الماضي.",
        example: "Wir leben in der Gegenwart, nicht in der Vergangenheit.",
        exampleAr: "نحن نعيش ونبني في الحاضر، وليس في زمن الماضي الراحل.",
        partOfSpeech: "noun",
        ipa: "/ˈɡeːɡn̩vaːɐ̯t/",
        language: "german",
        genderArticle: "die"
      },
      {
        word: "Voraussetzung",
        meaningEn: "Prerequisite; necessary condition or requirement.",
        meaningAr: "شرط أساسي / متطلب سابق - ظرف إلزامي لابد من تحققه أولاً.",
        example: "Die B2-Prüfung ist eine wichtige Voraussetzung für das Studium.",
        exampleAr: "يعد اجتياز اختبار B2 شرطاً جوهرياً ومسبقاً للالتحاق بالدراسة الجامعية.",
        partOfSpeech: "noun",
        ipa: "/foˈʁaʊ̯sˌzɛt͡sʊŋ/",
        language: "german",
        genderArticle: "die"
      },
      {
        word: "Wahrnehmung",
        meaningEn: "Perception; internal cognitive observation.",
        meaningAr: "إدراك / حس بالوعي - رصد الحواس وتأويلها ذهنياً.",
        example: "Unsere visuelle Wahrnehmung kann uns manchmal täuschen.",
        exampleAr: "إن إدراكنا وبصيرتنا البصرية قد يخدعاننا أحياناً.",
        partOfSpeech: "noun",
        ipa: "/ˈvaːɐ̯neːmʊŋ/",
        language: "german",
        genderArticle: "die"
      },
      {
        word: "Einfluss",
        meaningEn: "Influence; authority or impact over others.",
        meaningAr: "تأثير / نفوذ - الأثر الموجه لقرارات الآخرين أو أفعالهم.",
        example: "Sein literarisches Werk hat einen bleibenden Einfluss.",
        exampleAr: "يمتلك عمله ومؤلفه الأدبي تأثيراً ونفوذاً باقياً وخالداً.",
        partOfSpeech: "noun",
        ipa: "/ˈaɪ̯nˌflʊs/",
        language: "german",
        genderArticle: "der"
      }
    ],
    C2: [
      {
        word: "Beeinträchtigung",
        meaningEn: "Impairment or detriment; disturbance.",
        meaningAr: "إعاقة / ضعف أو ضرر - تأثير سلبي يحد من كفاءة أو راحة العمل.",
        example: "Der Lärm führte zu einer erheblichen Beeinträchtigung beim Schlafen.",
        exampleAr: "أدت الضوضاء إلى اضطراب وضعف جسيم في جودة السائل النوم.",
        partOfSpeech: "noun",
        ipa: "/bəˈʔaɪ̯ntʁɛçtɪɡʊŋ/",
        language: "german",
        genderArticle: "die"
      },
      {
        word: "Gleichgewicht",
        meaningEn: "Equilibrium or balance; steady state.",
        meaningAr: "توازن / استقرار - الحالة التي يعادل فيها كل جانب الآخر.",
        example: "Ein gesundes Gleichgewicht von Arbeit und Leben ist essenziell.",
        exampleAr: "يُعد إحراز توازن صحي سليم بين العمل والحياة أمراً جوهرياً.",
        partOfSpeech: "noun",
        ipa: "/ˈɡlaɪçɡəˌvɪçt/",
        language: "german",
        genderArticle: "das"
      },
      {
        word: "Selbstverständlichkeit",
        meaningEn: "A matter of course; obvious standard.",
        meaningAr: "بديهية / أمر مفروغ منه - شيء مألوف ومسلم به لا يحتاج للتبرير.",
        example: "Höflichkeit sollte eine Selbstverständlichkeit im Alltag sein.",
        exampleAr: "يجب أن تكون اللياقة والأدب بديهية وأمراً مفروغاً منه في السلوك اليومي.",
        partOfSpeech: "noun",
        ipa: "/ˈzɛlpstfɛɐ̯ˌʃtɛntlɪçkaɪt/",
        language: "german",
        genderArticle: "die"
      },
      {
        word: "Auseinandersetzung",
        meaningEn: "Analytical discussion or confrontation; thorough debate.",
        meaningAr: "نقاش مكثف / مجابهة فكرية - معالجة تحليلية معمقة وحوار مواجهة.",
        example: "Das Buch fördert die kritische Auseinandersetzung mit der Geschichte.",
        exampleAr: "يحث الكتاب القراء على المجابهة الفكرية والنقاش النقدي للتاريخ.",
        partOfSpeech: "noun",
        ipa: "/aʊ̯sʔaɪˈnandɐˌzɛt͡sʊŋ/",
        language: "german",
        genderArticle: "die"
      },
      {
        word: "unverzüglich",
        meaningEn: "Immediate; promptly with no delay.",
        meaningAr: "فوري / دون إبطاء - القيام بالفعل على الفور دون تأجيل أو تسويف.",
        example: "Senden Sie uns im Falle eines Fehlers bitte unverzüglich eine Mitteilung.",
        exampleAr: "في حالة حدوث عطل لغوي، يرجى إرسال إشعار فوري وعاجل لنا دون إبطاء.",
        partOfSpeech: "adjective",
        ipa: "/ʊnfɛɐ̯ˈt͡syːklɪç/",
        language: "german",
        genderArticle: ""
      }
    ]
  }
};

export function getFallbackWords(
  level: ProficiencyLevel,
  language: 'english' | 'german'
): GeminiWordResult[] {
  const normalizedLang = language === 'german' ? 'german' : 'english';
  const list = FALLBACK_VOCABULARY[normalizedLang][level] || FALLBACK_VOCABULARY[normalizedLang]['A1'];
  // Return copies to prevent mutate side effects
  return list.map(item => ({ ...item }));
}
