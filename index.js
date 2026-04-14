require('dotenv').config();
const { Telegraf, Markup, session } = require('telegraf');
const OpenAI = require('openai');
const mongoose = require('mongoose');

const BOT_TOKEN    = process.env.BOT_TOKEN;
const GROQ_KEY     = process.env.GROQ_API_KEY;
const MONGO_URI    = process.env.MONGODB_URI;
const ADMIN_IDS    = (process.env.ADMIN_IDS || '').split(',').map(id => parseInt(id)).filter(Boolean);

if (!BOT_TOKEN || !GROQ_KEY) {
  console.error('Missing BOT_TOKEN or GROQ_API_KEY');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

const client = new OpenAI({
  apiKey: GROQ_KEY,
  baseURL: 'https://api.groq.com/openai/v1' 
});

async function askAI(prompt) {
  const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];
  
  for (const modelName of models) {
    try {
      const response = await client.chat.completions.create({
        model: modelName,
        messages: [{ role: "user", content: prompt }]
      });
      return response.choices[0].message.content;
    } catch (err) {
      console.error(`Groq Attempt (${modelName}) failed:`, err.message);
      continue;
    }
  }
  return "❌ فشل الاتصال بالذكاء الاصطناعي المجاني.\n\nيرجى المحاولة لاحقاً أو التأكد من سلامة مفتاح Groq.";
}

const mainMenu = (ctx) => {
  const buttons = [
    [Markup.button.callback('📊 إنشاء إشارة تداول', 'cmd_new_signal')],
    [Markup.button.callback('✍️ صياغة بوست احترافي', 'cmd_ai_writing')],
    [Markup.button.callback('📢 إدارة القنوات', 'cmd_channels_mgmt'), Markup.button.callback('📂 الإشارات السابقة', 'cmd_history')],
    [Markup.button.callback('🤖 اسأل الذكاء الاصطناعي', 'cmd_ask_ai')]
  ];
  return { 
    text: `💎 *لوحة التحكم المتقدمة (Llama 3 AI)*\n\nتواصل مباشر مع أحدث موديلات Llama 3 عبر Groq (مجاني وسريع). كيف يمكنني مساعدتك؟`,
    extra: { parse_mode: 'Markdown', ...Markup.inlineKeyboard(buttons) }
  };
};

bot.use(session());

bot.on('message', async (ctx, next) => {
  if (ctx.from) console.log(`[LOG] ${ctx.from.id}: ${ctx.message?.text || ctx.callbackQuery?.data}`);
  await next();
});

const isAdmin = (ctx) => ADMIN_IDS.includes(ctx.from?.id);

bot.start((ctx) => {
  const menu = mainMenu(ctx);
  ctx.reply(menu.text, menu.extra);
});

bot.action('cmd_ai_writing', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('✍️ *أرسل لي مسودة البوست*\nوسأستخدم ذكاء Llama 3 لصياغته بشكل احترافي ومجاني.', { parse_mode: 'Markdown' });
  ctx.session = { awaitingType: 'ai_rewrite' };
});

bot.action('cmd_ask_ai', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('🤖 *أنا أسمعك..*\nأرسل سؤالك وسأجيبك باستخدام أسرع ذكاء اصطناعي (Groq).', { parse_mode: 'Markdown' });
  ctx.session = { awaitingType: 'ai_ask' };
});

bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  const session = ctx.session || {};

  if (session.awaitingType === 'ai_rewrite' || session.awaitingType === 'ai_ask') {
    const thinking = await ctx.reply('⏳ جاري المعالجة بذكاء Llama 3...');
    const result = await askAI(text);
    try { await ctx.telegram.deleteMessage(ctx.chat.id, thinking.message_id); } catch(e) {}
    ctx.reply(result, { parse_mode: 'Markdown' });
    ctx.session = {};
    return;
  }

  if (!text.startsWith('/')) {
    const thinking = await ctx.reply('💡 ثوانٍ...');
    const result = await askAI(text);
    try { await ctx.telegram.deleteMessage(ctx.chat.id, thinking.message_id); } catch(e) {}
    ctx.reply(result, { parse_mode: 'Markdown' });
  }
});

(async () => {
  try {
    if (MONGO_URI && !MONGO_URI.includes('your_mongodb')) {
      await mongoose.connect(MONGO_URI);
      console.log('✅ MongoDB Connected');
    }
  } catch (err) {
    console.log('⚠️ MongoDB not connected, using memory session');
  }
  
  console.log('🚀 Bot starting...');
  await bot.launch();
  console.log('✅ Bot is LIVE!');
})();

process.once('SIGINT',  () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
