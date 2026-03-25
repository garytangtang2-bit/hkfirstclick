/**
 * Fix Simplified Chinese → Traditional Chinese in food/attractions zh translations
 * Uses a comprehensive character mapping table
 */
import fs from "fs";
import path from "path";

// Comprehensive Simplified → Traditional mapping for travel content
const SIMP_TO_TRAD = {
  // Common simplified chars found in the data
  这: "這",
  们: "們",
  实: "實",
  专: "專",
  热: "熱",
  传: "傳",
  观: "觀",
  给: "給",
  让: "讓",
  变: "變",
  总: "總",
  联: "聯",
  应: "應",
  该: "該",
  爱: "愛",
  时: "時",
  间: "間",
  动: "動",
  处: "處",
  见: "見",
  丰: "豐",
  满: "滿",
  样: "樣",
  说: "說",
  问: "問",
  带: "帶",
  为: "為",
  发: "發",
  对: "對",
  关: "關",
  现: "現",
  从: "從",
  长: "長",
  尝: "嚐",
  试: "試",
  欢: "歡",
  迎: "迎", // same in both
  选: "選",
  择: "擇",
  著: "著", // same
  名: "名", // same
  氛: "氛", // same
  围: "圍",
  友: "友", // same
  好: "好", // same
  服: "服", // same
  务: "務",
  // More common ones
  个: "個",
  国: "國",
  来: "來",
  开: "開",
  与: "與",
  宁: "寧",
  静: "靜",
  结: "結",
  合: "合", // same
  奢: "奢", // same
  华: "華",
  场: "場",
  际: "際",
  适: "適",
  万: "萬",
  类: "類",
  种: "種",
  风: "風",
  格: "格", // same
  闻: "聞",
  乐: "樂",
  趣: "趣", // same
  标: "標",
  志: "志", // same
  综: "綜",
  览: "覽",
  艺: "藝",
  术: "術",
  历: "歷",
  史: "史", // same
  丰: "豐",
  富: "富", // same
  饮: "飲",
  食: "食", // same
  馆: "館",
  厅: "廳",
  餐: "餐", // same
  调: "調",
  酿: "釀",
  购: "購",
  营: "營",
  运: "運",
  经: "經",
  验: "驗",
  业: "業",
  设: "設",
  计: "計",
  产: "產",
  内: "內",
  还: "還",
  虑: "慮",
  览: "覽",
  汇: "匯",
  济: "濟",
  节: "節",
  环: "環",
  境: "境", // same
  响: "響",
  达: "達",
  体: "體",
  验: "驗",
  组: "組",
  织: "織",
  统: "統",
  丰: "豐",
  够: "夠",
  单: "單",
  独: "獨",
  务: "務",
  较: "較",
  贵: "貴",
  价: "價",
  钱: "錢",
  费: "費",
  货: "貨",
  进: "進",
  出: "出", // same
  场: "場",
  馆: "館",
  阿: "阿", // same
  尔: "爾",
  哈: "哈", // same
  卡: "卡", // same
  拉: "拉", // same
  热: "熱",
  闹: "鬧",
  乱: "亂",
  杂: "雜",
  忙: "忙", // same
  繁: "繁", // same
  华: "華",
  丽: "麗",
  细: "細",
  腻: "膩",
  浓: "濃",
  郁: "郁", // same
  香: "香", // same
  甜: "甜", // same
  辣: "辣", // same
  鲜: "鮮",
  嫩: "嫩", // same
  软: "軟",
  硬: "硬", // same
  稳: "穩",
  纯: "純",
  洁: "潔",
  净: "淨",
  悠: "悠", // same
  闲: "閒",
  优: "優",
  雅: "雅", // same
  随: "隨",
  意: "意", // same
  轻: "輕",
  松: "鬆",
  极: "極",
  佳: "佳", // same
  顶: "頂",
  级: "級",
  一: "一", // same
  流: "流", // same
  著: "著",
  称: "稱",
  誉: "譽",
  // Food specific
  烹: "烹", // same
  饪: "飪",
  调: "調",
  味: "味", // same
  料: "料", // same
  理: "理", // same
  菜: "菜", // same
  肴: "肴", // same
  酒: "酒", // same
  水: "水", // same
  果: "果", // same
  茶: "茶", // same
  咖: "咖", // same
  啡: "啡", // same
  // place
  岛: "島",
  湾: "灣",
  海: "海", // same
  滩: "灘",
  河: "河", // same
  江: "江", // same
  山: "山", // same
  谷: "谷", // same
  园: "園",
  区: "區",
  县: "縣",
  市: "市", // same
  镇: "鎮",
  村: "村", // same
  街: "街", // same
  道: "道", // same
  路: "路", // same
  桥: "橋",
  楼: "樓",
  塔: "塔", // same
  庙: "廟",
  寺: "寺", // same
  宫: "宮",
  殿: "殿", // same
  堂: "堂", // same
  院: "院", // same
  所: "所", // same
  处: "處",
  地: "地", // same
  点: "點",
  线: "線",
  面: "面", // same
  // travel
  旅: "旅", // same
  游: "遊",
  行: "行", // same
  走: "走", // same
  看: "看", // same
  吃: "吃", // same
  喝: "喝", // same
  玩: "玩", // same
  逛: "逛", // same
  买: "買",
  拍: "拍", // same
  照: "照", // same
  片: "片", // same
  图: "圖",
  景: "景", // same
  色: "色", // same
  美: "美", // same
  丽: "麗",
  壮: "壯",
  观: "觀",
  // other common
  虽: "雖",
  然: "然", // same
  但: "但", // same
  而: "而", // same
  且: "且", // same
  也: "也", // same
  都: "都", // same
  已: "已", // same
  经: "經",
  更: "更", // same
  最: "最", // same
  非: "非", // same
  常: "常", // same
  很: "很", // same
  特: "特", // same
  别: "別",
  分: "分", // same
  外: "外", // same
  此: "此", // same
  其: "其", // same
  他: "他", // same
  们: "們",
  自: "自", // same
  己: "己", // same
  我: "我", // same
  你: "你", // same
  他: "他", // same
  她: "她", // same
  它: "它", // same
  这: "這",
  那: "那", // same
  什: "什", // same
  么: "麼",
  谁: "誰",
  哪: "哪", // same
  当: "當",
  然: "然", // same
  如: "如", // same
  果: "果", // same
  虽: "雖",
  然: "然", // same
  因: "因", // same
  为: "為",
  所: "所", // same
  以: "以", // same
  和: "和", // same
  与: "與",
  或: "或", // same
  以: "以", // same
  及: "及", // same
  还: "還",
  有: "有", // same
  没: "沒",
  无: "無",
  不: "不", // same
  是: "是", // same
  在: "在", // same
  了: "了", // same
  的: "的", // same
  地: "地", // same
  得: "得", // same
  着: "著",
  过: "過",
  来: "來",
  去: "去", // same
  上: "上", // same
  下: "下", // same
  中: "中", // same
  里: "裡",
  内: "內",
  外: "外", // same
  前: "前", // same
  后: "後",
  左: "左", // same
  右: "右", // same
  大: "大", // same
  小: "小", // same
  多: "多", // same
  少: "少", // same
  高: "高", // same
  低: "低", // same
  新: "新", // same
  旧: "舊",
  好: "好", // same
  坏: "壞",
  轻: "輕",
  重: "重", // same
  快: "快", // same
  慢: "慢", // same
  长: "長",
  短: "短", // same
  远: "遠",
  近: "近", // same
  早: "早", // same
  晚: "晚", // same
  热: "熱",
  冷: "冷", // same
  // Numbers / measure
  万: "萬",
  亿: "億",
  盘: "盤",
  东: "東",
  // Specific chars from the scan results
  宁: "寧",
  结: "結",
  华: "華",
  误: "誤",
  错: "錯",
  够: "夠",
  较: "較",
  贵: "貴",
  费: "費",
  约: "約",
  级: "級",
  顶: "頂",
  细: "細",
  软: "軟",
  纯: "純",
  洁: "潔",
  净: "淨",
  优: "優",
  随: "隨",
  轻: "輕",
  极: "極",
  称: "稱",
  岛: "島",
  湾: "灣",
  滩: "灘",
  园: "園",
  区: "區",
  镇: "鎮",
  桥: "橋",
  楼: "樓",
  庙: "廟",
  宫: "宮",
  点: "點",
  线: "線",
  图: "圖",
  丽: "麗",
  壮: "壯",
  虽: "雖",
  别: "別",
  么: "麼",
  谁: "誰",
  当: "當",
  没: "沒",
  无: "無",
  里: "裡",
  后: "後",
  旧: "舊",
  坏: "壞",
  远: "遠",
  万: "萬",
  亿: "億",
  饪: "飪",
  鲜: "鮮",
  誉: "譽",
  涌: "湧",
  标: "標",
  综: "綜",
  览: "覽",
  艺: "藝",
  术: "術",
  历: "歷",
  饮: "飲",
  馆: "館",
  厅: "廳",
  调: "調",
  酿: "釀",
  购: "購",
  营: "營",
  运: "運",
  经: "經",
  验: "驗",
  业: "業",
  设: "設",
  计: "計",
  产: "產",
  还: "還",
  汇: "匯",
  济: "濟",
  节: "節",
  环: "環",
  响: "響",
  达: "達",
  体: "體",
  组: "組",
  织: "織",
  统: "統",
  单: "單",
  独: "獨",
  该: "該",
  闹: "鬧",
  乱: "亂",
  杂: "雜",
  繁: "繁",
  浓: "濃",
  软: "軟",
  稳: "穩",
  闲: "閒",
  轻: "輕",
  松: "鬆",
  种: "種",
  风: "風",
  闻: "聞",
  乐: "樂",
  买: "買",
  过: "過",
  来: "來",
  着: "著",
};

function convertSimpToTrad(text) {
  if (typeof text !== "string") return text;
  let result = "";
  for (const ch of text) {
    result += SIMP_TO_TRAD[ch] || ch;
  }
  return result;
}

function processObj(obj) {
  if (typeof obj === "string") return convertSimpToTrad(obj);
  if (Array.isArray(obj)) return obj.map(processObj);
  if (obj && typeof obj === "object") {
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
      result[k] = processObj(v);
    }
    return result;
  }
  return obj;
}

const dirs = ["src/data/food", "src/data/attractions"];
let totalFixed = 0;

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  for (const fname of files) {
    const filePath = path.join(dir, fname);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!data.translations?.zh) continue;

    // Only convert the zh translation
    const originalZh = JSON.stringify(data.translations.zh);
    data.translations.zh = processObj(data.translations.zh);
    const newZh = JSON.stringify(data.translations.zh);

    if (originalZh !== newZh) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
      totalFixed++;
      console.log(`✓ Fixed ${dir.split("/").pop()}/${fname}`);
    }
  }
}

console.log(`\nDone! Fixed ${totalFixed} files`);
