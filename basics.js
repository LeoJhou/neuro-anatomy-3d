/* 基礎概念（V149）：8 節文字＋SVG 示意＋「▶ 模型上看」。內容取自各課堂檔的老師版說明；核對紀錄在 notes/基礎概念_核對紀錄.md。
   用法：BASICS.init(容器, { demo(kind,id) → {name, guide}|null, has(kind,id), tab(name), scroller })
   注意：內容字串不能有反引號和 ${（make_artifact 會把整檔 inline 進 HTML）。紅、藍只用在動脈、靜脈。 */
(function () {
  "use strict";
  var KEY = "b9neuro.basics";
  var CSS = [
    "#paneBasics { padding-bottom: 14px; }",
    "#paneBasics .bnav { display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; margin: 2px 0 8px; }",
    "#paneBasics .bnav button { height: 30px; border: 1px solid var(--line); background: var(--chip); color: inherit; border-radius: 7px; font: 600 13px/1 var(--f-display, inherit); cursor: pointer; padding: 0; }",
    "#paneBasics .bnav button[aria-current=true] { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }",
    "#paneBasics .bsec h3 { margin: 4px 0 6px; font: 600 16px/1.3 var(--f-display, inherit); }",
    "#paneBasics .bsec h4 { margin: 12px 0 4px; font-size: 13.5px; }",
    "#paneBasics .bsec p { margin: 6px 0; font-size: 13.5px; line-height: 1.65; }",
    "#paneBasics .bsec ul, #paneBasics .bsec ol { margin: 6px 0; padding-left: 20px; font-size: 13.5px; line-height: 1.65; }",
    "#paneBasics .bsec li { margin: 2px 0; }",
    "#paneBasics .bsec .en { color: var(--mute); font-size: 12px; }",
    "#paneBasics .tw { overflow-x: auto; margin: 8px 0; }",
    "#paneBasics table { border-collapse: collapse; width: 100%; font-size: 12.5px; line-height: 1.5; }",
    "#paneBasics th, #paneBasics td { border: 1px solid var(--line); padding: 4px 6px; text-align: left; vertical-align: top; }",
    "#paneBasics th { background: var(--chip); font-weight: 600; white-space: nowrap; }",
    "#paneBasics .bfig { margin: 8px 0; }",
    "#paneBasics .bfig svg { width: 100%; max-width: 440px; height: auto; display: block; margin: 0 auto; }",
    "#paneBasics .bfig figcaption, #paneBasics .bcap { color: var(--mute); font-size: 11.5px; text-align: center; margin-top: 2px; }",
    "#paneBasics .ln { fill: none; stroke: var(--ink); stroke-width: 1.3; }",
    "#paneBasics .lt { fill: none; stroke: var(--mute); stroke-width: 1; }",
    "#paneBasics .ld { fill: none; stroke: var(--mute); stroke-width: 1.2; stroke-dasharray: 4 3; }",
    "#paneBasics .ax { fill: none; stroke: var(--accent); stroke-width: 2; }",
    "#paneBasics .axf { fill: var(--accent); }",
    "#paneBasics .tx { fill: var(--ink); font-size: 11px; }",
    "#paneBasics .tm { fill: var(--mute); font-size: 10px; }",
    "#paneBasics .tb { fill: var(--ink); font-size: 11px; font-weight: 600; }",
    "#paneBasics .gm { fill: var(--mute); fill-opacity: .5; stroke: var(--ink); stroke-width: 1; }",
    "#paneBasics .wm { fill: var(--panel); stroke: var(--ink); stroke-width: 1.2; }",
    "#paneBasics .art { fill: none; stroke: #d9483b; stroke-linecap: round; }",
    "#paneBasics .artf { fill: #d9483b; }",
    "#paneBasics .venf { fill: #3b7fd9; }",
    "#paneBasics .csf { fill: #2fa39a; fill-opacity: .28; stroke: #2fa39a; stroke-width: 1.2; }",
    "#paneBasics .bdemos { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; margin: 10px 0 4px; padding: 8px; border: 1px solid var(--line); border-radius: 9px; background: var(--chip); }",
    "#paneBasics .bdemos .bl { font-size: 12px; color: var(--mute); flex: 1 1 100%; }",
    "#paneBasics .bdemo { border: 1px solid var(--line); background: var(--panel); color: inherit; border-radius: 999px; padding: 4px 10px; font-size: 12.5px; cursor: pointer; white-space: nowrap; }",
    "#paneBasics .bdemo.on { border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); }",
    "#paneBasics .bmsg { font-size: 12.5px; margin: 4px 0 0; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }",
    "#paneBasics .bmsg[hidden] { display: none; }",
    "#paneBasics .bmsg button { border: 0; background: none; color: var(--accent); text-decoration: underline; cursor: pointer; padding: 2px 0; font-size: 12.5px; }",
    "#paneBasics .bstep { display: flex; justify-content: space-between; gap: 8px; margin-top: 14px; }",
    "#paneBasics .bstep button { flex: 1; border: 1px solid var(--line); background: var(--chip); color: inherit; border-radius: 8px; padding: 7px 8px; font-size: 13px; cursor: pointer; }",
    "#paneBasics .bstep button:disabled { opacity: .4; cursor: default; }",
    "#paneBasics .bstep button.pri { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }",
    "@media (max-width: 820px) { #paneBasics .bnav button { height: 36px; } #paneBasics .bdemo { padding: 7px 12px; } }"
  ].join("\n");

  function d(k, id, label) { return '<button type="button" class="bdemo" data-k="' + k + '" data-id="' + id + '">▶ ' + label + '</button>'; }
  function demos(list) { return '<div class="bdemos"><span class="bl">模型上看（點了會切換中間的 3D）</span>' + list.join("") + '<div class="bmsg" hidden></div></div>'; }
  function fig(svg, cap) { return '<figure class="bfig">' + svg + (cap ? '<figcaption>' + cap + '</figcaption>' : '') + '</figure>'; }
  var ARROW = '<defs><marker id="bArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" class="axf"/></marker><marker id="bArrM" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="var(--mute)"/></marker></defs>';

  /* ---------- 1 方位 ---------- */
  var SVG1 = '<svg viewBox="0 0 340 196" role="img" aria-label="矢狀面示意：神經軸在中腦與間腦交界轉彎">' + ARROW +
    '<path class="ln" d="M38,80 C38,34 104,14 168,18 C236,22 292,48 292,90 C292,110 268,120 244,117 L200,111 C178,110 158,117 144,120 C100,128 38,122 38,80 Z"/>' +
    '<ellipse class="ln" cx="244" cy="140" rx="36" ry="20"/>' +
    '<path class="ln" d="M170,108 L198,106 L212,186 L194,188 Z"/>' +
    '<polyline class="ax" points="203,184 186,104 52,76" marker-start="url(#bArr)" marker-end="url(#bArr)"/>' +
    '<circle cx="186" cy="104" r="4" class="axf"/>' +
    '<text class="tb" x="192" y="98">轉彎處</text><text class="tm" x="192" y="86">中腦—間腦交界</text>' +
    '<text class="tx" x="6" y="72">吻側</text><text class="tm" x="6" y="84">額極</text>' +
    '<text class="tx" x="216" y="190">尾側（往脊髓）</text>' +
    '<line class="lt" x1="112" y1="64" x2="112" y2="30" marker-end="url(#bArrM)"/><text class="tx" x="118" y="38">背側（頭頂）</text>' +
    '<line class="lt" x1="112" y1="94" x2="112" y2="116" marker-end="url(#bArrM)"/><text class="tx" x="64" y="112">腹側</text>' +
    '<line class="lt" x1="186" y1="150" x2="150" y2="156" marker-end="url(#bArrM)"/><text class="tx" x="100" y="162">腹側（前）</text>' +
    '<line class="lt" x1="208" y1="146" x2="226" y2="143" marker-end="url(#bArrM)"/>' +
    '<text class="tx" x="250" y="172">背側（後）</text><line class="lt" x1="248" y1="168" x2="228" y2="146"/>' +
    '<text class="tm" x="296" y="94">枕極</text>' +
    '</svg>';
  var S1 = '<p>神經軸（腦和脊髓的長軸）在中腦與間腦交界向前彎。所以同一個方位詞，在前腦和在腦幹、脊髓指的方向不一樣。</p>' +
    fig(SVG1, '示意。粗線＝神經軸；臉朝左。') +
    '<div class="tw"><table><tr><th>方位詞</th><th>腦幹、脊髓</th><th>前腦（大腦、間腦）</th></tr>' +
    '<tr><td>吻側 <span class="en">rostral</span></td><td>往上（往中腦）</td><td>往前（額極）</td></tr>' +
    '<tr><td>尾側 <span class="en">caudal</span></td><td>往下（往脊髓）</td><td>往後（枕極）</td></tr>' +
    '<tr><td>背側 <span class="en">dorsal</span></td><td>往後</td><td>往上（頭頂）</td></tr>' +
    '<tr><td>腹側 <span class="en">ventral</span></td><td>往前</td><td>往下（腦底）</td></tr></table></div>' +
    '<ul><li><b>切面</b>：矢狀面分左右，冠狀面分前後，水平面分上下。腦幹和脊髓的橫切面垂直於它自己的長軸。</li>' +
    '<li><b>同側、對側</b>：相對於病灶（或路徑起點）那一側來說。</li>' +
    '<li><b>這個模型</b>：左下角的方位小方塊標「吻側／尾側、背側／腹側、左 L／右 R」，用的是腦幹的方位；視角鈕「前（腹側）」「後（背側）」也是。</li></ul>' +
    demos([d("v", "solid", "腦幹外觀"), d("v", "lobes", "大腦分葉"), d("v", "lab_cc", "正中矢狀面")]);

  /* ---------- 2 分區 ---------- */
  var SVG2 = '<svg viewBox="0 0 340 196" role="img" aria-label="矢狀面示意：中樞神經系統分區">' +
    '<path d="M38,80 C38,34 104,14 168,18 C236,22 292,48 292,90 C292,110 268,120 244,117 L206,111 C200,92 176,84 152,90 C140,94 134,108 138,121 C98,128 38,122 38,80 Z" fill="#c9a227" fill-opacity=".3" stroke="var(--ink)" stroke-width="1.2"/>' +
    '<ellipse cx="172" cy="104" rx="30" ry="14" fill="#8e6bd1" fill-opacity=".4" stroke="var(--ink)" stroke-width="1.2"/>' +
    '<path d="M172,119 L200,116 L203,134 L176,137 Z" fill="#3d8f47" fill-opacity=".4" stroke="var(--ink)" stroke-width="1.2"/>' +
    '<path d="M176,137 L203,134 L206,156 L180,160 C164,158 164,140 176,137 Z" fill="#d98a1f" fill-opacity=".4" stroke="var(--ink)" stroke-width="1.2"/>' +
    '<path d="M180,160 L206,156 L210,176 L190,179 Z" fill="#2fa39a" fill-opacity=".4" stroke="var(--ink)" stroke-width="1.2"/>' +
    '<path d="M190,179 L210,176 L213,194 L196,196 Z" fill="var(--mute)" fill-opacity=".35" stroke="var(--ink)" stroke-width="1.2"/>' +
    '<ellipse cx="246" cy="146" rx="36" ry="21" fill="#9a7b5c" fill-opacity=".4" stroke="var(--ink)" stroke-width="1.2"/>' +
    '<text class="tb" x="90" y="62">端腦</text><text class="tb" x="160" y="108">間腦</text>' +
    '<text class="tx" x="118" y="132">中腦</text><line class="lt" x1="144" y1="129" x2="176" y2="127"/>' +
    '<text class="tx" x="118" y="152">橋腦</text><line class="lt" x1="144" y1="149" x2="168" y2="149"/>' +
    '<text class="tx" x="118" y="172">延腦</text><line class="lt" x1="144" y1="169" x2="184" y2="168"/>' +
    '<text class="tx" x="150" y="192">脊髓</text><line class="lt" x1="176" y1="189" x2="194" y2="188"/>' +
    '<text class="tb" x="234" y="150">小腦</text>' +
    '</svg>';
  var S2 = fig(SVG2, '示意，臉朝左。') +
    '<ul><li><b>前腦</b>＝端腦＋間腦；<b>腦幹</b>＝中腦＋橋腦＋延腦；小腦在腦幹背側，以三對小腦腳連接腦幹。</li></ul>' +
    '<div class="tw"><table><tr><th>分區</th><th>內容</th><th>裡面的腦室</th></tr>' +
    '<tr><td>端腦</td><td>大腦半球：皮質、白質、基底核</td><td>側腦室</td></tr>' +
    '<tr><td>間腦</td><td>視丘、上視丘、底視丘、下視丘</td><td>第三腦室</td></tr>' +
    '<tr><td>中腦</td><td>頂蓋（上丘、下丘）、被蓋、大腦腳</td><td>中腦導水管</td></tr>' +
    '<tr><td>橋腦、延腦上半</td><td>腹側是基底部與錐體，背側是被蓋</td><td>第四腦室（在背側，頂是小腦）</td></tr>' +
    '<tr><td>延腦下半、脊髓</td><td>脊髓 31 節</td><td>中央管</td></tr></table></div>' +
    '<ul><li><b>小腦</b>：原裂分開前葉與後葉；後外側裂分開後葉與絨球小結葉。</li>' +
    '<li><b>脊髓</b>：外觀不分節，功能上分 31 節（頸 8、胸 12、腰 5、薦 5、尾 1）。頸膨大發出臂神經叢，腰膨大發出腰薦神經叢；脊髓圓錐的尖端約在 L1–L2 椎骨高度。</li></ul>' +
    demos([d("v", "lobes", "大腦分葉"), d("v", "dien4", "間腦四部分"), d("v", "solid", "腦幹外觀"), d("v", "cb_lobe", "小腦分葉"), d("v", "v_cord_full", "脊髓全長")]);

  /* ---------- 3 灰質白質 ---------- */
  var SVG3 = '<svg viewBox="0 0 340 186" role="img" aria-label="大腦冠狀切面與脊髓橫切面的灰質、白質位置">' +
    '<path class="gm" d="M20,96 C20,42 52,18 90,18 C128,18 160,42 160,96 C160,132 132,150 90,150 C48,150 20,132 20,96 Z"/>' +
    '<path class="wm" d="M34,96 C34,54 58,32 90,32 C122,32 146,54 146,96 C146,124 124,138 90,138 C56,138 34,124 34,96 Z"/>' +
    '<ellipse class="gm" cx="70" cy="98" rx="13" ry="18"/><ellipse class="gm" cx="110" cy="98" rx="13" ry="18"/>' +
    '<text class="tx" x="64" y="12">皮質（灰質）</text><line class="lt" x1="90" y1="15" x2="90" y2="24"/>' +
    '<text class="tx" x="78" y="56">白質</text>' +
    '<text class="tx" x="56" y="165">深部核團（灰質）</text><line class="lt" x1="96" y1="155" x2="106" y2="114"/>' +
    '<text class="tm" x="62" y="182">大腦冠狀切面</text>' +
    '<circle class="wm" cx="256" cy="92" r="56"/>' +
    '<path class="gm" d="M240,52 C232,56 230,70 238,84 L247,90 L247,97 C234,102 222,112 225,126 C230,138 246,133 249,120 L250,101 L262,101 L263,120 C266,133 282,138 287,126 C290,112 278,102 265,97 L265,90 L274,84 C282,70 280,56 272,52 C265,58 264,78 262,89 L250,89 C248,78 247,58 240,52 Z"/>' +
    '<text class="tx" x="244" y="48">後索</text>' +
    '<text class="tx" x="202" y="96">外側索</text>' +
    '<text class="tx" x="244" y="144">前索</text>' +
    '<text class="tx" x="290" y="40">後角</text><line class="lt" x1="290" y1="42" x2="274" y2="60"/>' +
    '<text class="tx" x="298" y="150">前角</text><line class="lt" x1="300" y1="140" x2="284" y2="124"/>' +
    '<text class="tm" x="208" y="182">脊髓橫切面（上＝背側）</text>' +
    '</svg>';
  var S3 = '<p><b>灰質</b>是神經元細胞體集中的地方；<b>白質</b>是有髓鞘的軸突束。</p>' +
    fig(SVG3, '示意。大腦灰質在外，脊髓灰質在內。') +
    '<ul><li><b>大腦、小腦</b>：灰質在外（皮質），白質在內；深部另有核團（基底核、視丘、小腦深部核）。</li>' +
    '<li><b>脊髓</b>：灰質在內，呈 H 形。後角收感覺，前角發出運動神經元，胸腰段另有側角（自律神經節前神經元）。白質在外，分後索、外側索、前索。</li>' +
    '<li><b>名稱</b>：中樞裡一群細胞體叫「核」，周邊的叫「神經節」。中樞裡的軸突束叫徑、束、蹄系、索；周邊的叫「神經」。</li></ul>' +
    '<div class="tw"><table><tr><th>大腦白質</th><th>連哪裡</th><th>例子</th></tr>' +
    '<tr><td>聯合纖維</td><td>同一半球內的皮質</td><td>短的 U 形纖維連相鄰腦迴</td></tr>' +
    '<tr><td>連合纖維</td><td>左右半球</td><td>胼胝體、前連合、後連合</td></tr>' +
    '<tr><td>投射纖維</td><td>皮質和下方的構造</td><td>放射冠 → 內囊 → 大腦腳</td></tr></table></div>' +
    demos([d("v", "wm", "大腦白質"), d("v", "bg", "基底核"), d("v", "v_cord_gray", "脊髓灰質"), d("v", "v_cord_x", "脊髓橫切")]);

  /* ---------- 4 功能成分與核柱 ---------- */
  var SVG4 = '<svg viewBox="0 0 340 150" role="img" aria-label="第四腦室底半側示意：界溝內側是運動核，外側是感覺核">' +
    '<text class="tm" x="120" y="14">第四腦室底（半側，從背面看）</text>' +
    '<line class="ld" x1="24" y1="22" x2="24" y2="126"/><text class="tm" x="8" y="140">中線</text>' +
    '<line class="ld" x1="176" y1="22" x2="176" y2="126"/><text class="tb" x="162" y="140">界溝</text>' +
    '<rect x="34" y="30" width="132" height="88" rx="8" fill="#f0a030" fill-opacity=".14" stroke="#d98a1f" stroke-width="1.2"/>' +
    '<rect x="186" y="30" width="144" height="88" rx="8" fill="#3d8f47" fill-opacity=".14" stroke="#3d8f47" stroke-width="1.2"/>' +
    '<text class="tb" x="52" y="48">運動核（基板）</text><text class="tb" x="206" y="48">感覺核（翼板）</text>' +
    '<g font-size="11" text-anchor="middle">' +
    '<rect x="42" y="62" width="36" height="24" rx="5" class="wm"/><text class="tx" x="60" y="78">GSE</text>' +
    '<rect x="82" y="62" width="36" height="24" rx="5" class="wm"/><text class="tx" x="100" y="78">SVE</text>' +
    '<rect x="122" y="62" width="36" height="24" rx="5" class="wm"/><text class="tx" x="140" y="78">GVE</text>' +
    '<rect x="190" y="62" width="62" height="24" rx="5" class="wm"/><text class="tx" x="221" y="78" font-size="10">GVA、SVA</text>' +
    '<rect x="255" y="62" width="33" height="24" rx="5" class="wm"/><text class="tx" x="271.5" y="78">GSA</text>' +
    '<rect x="291" y="62" width="33" height="24" rx="5" class="wm"/><text class="tx" x="307.5" y="78">SSA</text></g>' +
    '<text class="tm" x="44" y="106">內側</text><text class="tm" x="296" y="106">外側</text>' +
    '</svg>';
  var S4 = '<p>每個功能成分用三個字母表示：</p>' +
    '<ul><li>第一個字母：<b>G</b> 一般、<b>S</b> 特殊。</li><li>第二個字母：<b>S</b> 體（皮膚、骨骼肌）、<b>V</b> 內臟。</li><li>第三個字母：<b>A</b> 傳入（感覺）、<b>E</b> 傳出（運動）。</li></ul>' +
    '<div class="tw"><table><tr><th>成分</th><th>管什麼</th><th>顱神經</th><th>腦幹的核</th></tr>' +
    '<tr><td>GSE</td><td>眼外肌、舌肌</td><td>III、IV、VI、XII</td><td>動眼、滑車、外展、舌下神經核</td></tr>' +
    '<tr><td>SVE</td><td>咽弓來的骨骼肌</td><td>V、VII、IX、X、XI（延腦根）</td><td>三叉神經運動核、顏面神經運動核、疑核（IX、X、XI）</td></tr>' +
    '<tr><td>GVE</td><td>副交感節前</td><td>III、VII、IX、X</td><td>E-W 核、上唾液核、下唾液核、迷走背核</td></tr>' +
    '<tr><td>GVA、SVA</td><td>內臟感覺、味覺</td><td>VII、IX、X</td><td>孤立徑核</td></tr>' +
    '<tr><td>GSA</td><td>頭臉的痛、溫、觸、本體覺</td><td>V（另收 VII、IX、X 的 GSA）</td><td>三叉神經核群（中腦核、橋腦感覺核、脊髓核）</td></tr>' +
    '<tr><td>SSA</td><td>視覺、聽覺、平衡</td><td>II、VIII</td><td>耳蝸核、前庭核（VIII）</td></tr></table></div>' +
    '<p>副神經的脊髓根（C1–C5）在這個模型另列為 SE。</p>' +
    fig(SVG4, '示意：只表示界溝的內、外，不表示各核柱的確切位置。') +
    '<ul><li><b>界溝</b>是第四腦室底的縱溝：內側是運動核，外側是感覺核。</li>' +
    '<li>腦幹的感覺核是二級神經元，一級在顱神經節。例外是三叉神經中腦核，它本身就是一級神經元。</li>' +
    '<li>一個核可以收好幾條顱神經：孤立徑核收 VII、IX、X；三叉神經脊髓核收 V、VII、IX、X 的 GSA；疑核發出 IX、X、XI。</li></ul>' +
    demos([d("v", "back", "背面核團圖"), d("v", "side", "側面核團圖"), d("v", "gang", "神經節與中樞核"), d("t", "fc", "核團對照表")]);

  /* ---------- 5 傳導路徑 ---------- */
  var SVG5 = '<svg viewBox="0 0 340 190" role="img" aria-label="三級神經元示意：一級在神經節，二級軸突交叉，三級在視丘">' + ARROW +
    '<line class="ld" x1="170" y1="16" x2="170" y2="182"/><text class="tm" x="158" y="12">中線</text>' +
    '<text class="tm" x="40" y="12">同側（受器那一側）</text><text class="tm" x="250" y="12">對側</text>' +
    '<circle cx="40" cy="166" r="5" class="gm"/><text class="tx" x="24" y="186">受器</text>' +
    '<circle cx="92" cy="166" r="9" fill="#3d8f47" fill-opacity=".35" stroke="#3d8f47" stroke-width="1.4"/><text class="tb" x="88.5" y="170">1</text><text class="tx" x="70" y="186">神經節</text>' +
    '<line class="ln" x1="45" y1="166" x2="83" y2="166"/>' +
    '<circle cx="126" cy="118" r="9" fill="#d98a1f" fill-opacity=".35" stroke="#d98a1f" stroke-width="1.4"/><text class="tb" x="122.5" y="122">2</text><text class="tx" x="20" y="114">脊髓後角</text><text class="tx" x="20" y="127">或腦幹的核</text>' +
    '<path class="ln" d="M99,160 C112,150 118,138 122,127"/>' +
    '<path class="ax" d="M135,116 C170,112 204,104 230,74" marker-end="url(#bArr)"/>' +
    '<text class="tb" x="176" y="128">交叉</text><text class="tm" x="176" y="141">（二級的軸突）</text>' +
    '<circle cx="238" cy="64" r="9" fill="#8e6bd1" fill-opacity=".35" stroke="#8e6bd1" stroke-width="1.4"/><text class="tb" x="234.5" y="68">3</text><text class="tx" x="252" y="62">視丘</text><text class="tm" x="252" y="75">身體 VPL</text><text class="tm" x="252" y="87">頭臉 VPM</text>' +
    '<line class="ln" x1="238" y1="55" x2="238" y2="36" marker-end="url(#bArrM)"/><rect x="204" y="18" width="68" height="16" rx="4" class="gm"/><text class="tx" x="216" y="30">感覺皮質</text>' +
    '</svg>';
  var S5 = '<p>到意識的體感覺路徑都是三級神經元：<b>一級</b>在神經節，<b>二級</b>在脊髓或腦幹，<b>三級</b>在視丘，再上到皮質。越過中線的是二級神經元的軸突。</p>' +
    fig(SVG5, '示意。各路徑差別在二級神經元在哪裡、在哪一層交叉。') +
    '<div class="tw"><table><tr><th>路徑</th><th>傳什麼</th><th>二級神經元</th><th>交叉的地方</th><th>視丘</th></tr>' +
    '<tr><td>後索—內側蹄系</td><td>身體的精細觸覺、振動、本體覺</td><td>延腦的薄核、楔核</td><td>延腦</td><td>VPL</td></tr>' +
    '<tr><td>前外側系統</td><td>身體的痛、溫</td><td>脊髓後角</td><td>進入的那一節，經前白質連合</td><td>VPL</td></tr>' +
    '<tr><td>三叉：痛、溫</td><td>頭臉</td><td>三叉神經脊髓核</td><td>前三叉丘腦徑，交叉</td><td>VPM</td></tr>' +
    '<tr><td>三叉：觸、本體覺</td><td>頭臉</td><td>橋腦感覺核</td><td>前三叉丘腦徑交叉；背側三叉丘腦徑不交叉</td><td>兩側 VPM</td></tr></table></div>' +
    '<ul><li><b>病灶在哪一側</b>：後索—內側蹄系在延腦才交叉，脊髓病灶的缺損在同側，延腦以上在對側。前外側系統一進脊髓就交叉，脊髓病灶的缺損在對側，平面約在病灶下 1–2 節。</li>' +
    '<li><b>後索—內側蹄系不傳頭臉</b>，頭臉由三叉神經系統負責。</li>' +
    '<li><b>運動</b>：皮質脊髓徑在延腦的錐體交叉，約 85–90% 的纖維交叉。</li>' +
    '<li><b>視覺</b>：視網膜鼻側半的纖維在視交叉交叉，顳側半不交叉。</li></ul>' +
    demos([d("p", "sc_dcml", "後索—內側蹄系"), d("p", "sc_als", "前外側系統"), d("p", "trig", "三叉神經感覺"), d("p", "sc_cst", "皮質脊髓徑"), d("v", "lemnisci", "蹄系"), d("v", "vis_path", "視覺路徑")]);

  /* ---------- 6 腦室與 CSF ---------- */
  function box(x, y, w, t, cls) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="26" rx="6" class="' + (cls || "csf") + '"/><text class="tx" text-anchor="middle" x="' + (x + w / 2) + '" y="' + (y + 17) + '">' + t + '</text>'; }
  var SVG6 = '<svg viewBox="0 0 340 176" role="img" aria-label="腦脊髓液流向">' + ARROW +
    box(8, 12, 66, "側腦室") + box(136, 12, 70, "第三腦室") + box(264, 12, 70, "第四腦室") +
    '<line class="lt" x1="76" y1="25" x2="133" y2="25" marker-end="url(#bArrM)"/><text class="tm" text-anchor="middle" x="105" y="20">室間孔</text>' +
    '<line class="lt" x1="208" y1="25" x2="261" y2="25" marker-end="url(#bArrM)"/><text class="tm" text-anchor="middle" x="235" y="20">導水管</text>' +
    '<line class="lt" x1="299" y1="40" x2="299" y2="76" marker-end="url(#bArrM)"/><text class="tm" text-anchor="end" x="292" y="56">正中孔 ×1</text><text class="tm" text-anchor="end" x="292" y="68">外側孔 ×2</text>' +
    box(230, 80, 104, "蜘蛛膜下腔（腦池）") +
    '<line class="lt" x1="227" y1="93" x2="176" y2="93" marker-end="url(#bArrM)"/><text class="tm" text-anchor="middle" x="202" y="88">顆粒</text>' +
    '<rect x="94" y="80" width="80" height="26" rx="6" fill="#3b7fd9" fill-opacity=".22" stroke="#3b7fd9" stroke-width="1.2"/><text class="tx" text-anchor="middle" x="134" y="97">上矢狀竇</text>' +
    '<line class="lt" x1="91" y1="93" x2="52" y2="93" marker-end="url(#bArrM)"/><text class="tx" x="8" y="97">靜脈血</text>' +
    '<text class="tm" x="8" y="132">脈絡叢（製造）：側腦室的體、房、下角；第三腦室頂；第四腦室頂</text>' +
    '<text class="tm" x="8" y="148">沒有脈絡叢：側腦室前角、後角；中腦導水管</text>' +
    '<text class="tm" x="8" y="164">顆粒＝蜘蛛膜顆粒</text>' +
    '</svg>';
  var S6 = fig(SVG6, '') +
    '<p><b>流向</b>：側腦室 → 室間孔 → 第三腦室 → 中腦導水管 → 第四腦室 → 正中孔（1 個）、外側孔（2 個）→ 蜘蛛膜下腔 → 蜘蛛膜顆粒 → 上矢狀竇。</p>' +
    '<ul><li><b>製造</b>：脈絡叢，在側腦室的體、房、下角，第三腦室頂，第四腦室頂。側腦室前角、後角和中腦導水管沒有脈絡叢。</li>' +
    '<li><b>出口</b>：腦室通到蜘蛛膜下腔，只有第四腦室的三個孔。路上哪裡堵住，堵點上游的腦室就擴大。</li>' +
    '<li><b>回收</b>：主要經蜘蛛膜顆粒進上矢狀竇。另外三條：硬膜淋巴管 → 深頸淋巴結；沿嗅神經穿過篩板 → 鼻黏膜淋巴；glymphatic 系統（假說）。</li>' +
    '<li><b>腦池</b>：蜘蛛膜下腔比較寬的地方，例如小腦延髓池（大池，正中孔開口於此）、橋前池、腳間池、上池（四疊體池）。</li></ul>' +
    demos([d("v", "v_vent", "腦室系統"), d("v", "v_v34", "第三、四腦室"), d("v", "v_cist", "腦池"), d("p", "csf_flow", "CSF 流向"), d("p", "c17_prod", "CSF 製造"), d("v", "v17_drain", "CSF 回收")]);

  /* ---------- 7 血管 ---------- */
  var SVG7 = '<svg viewBox="0 0 340 200" role="img" aria-label="Willis 環示意（底面觀）">' +
    '<g class="art" stroke-width="2" stroke-opacity=".55">' +
    '<line x1="158" y1="46" x2="154" y2="14"/><line x1="182" y1="46" x2="186" y2="14"/>' +
    '<line x1="128" y1="82" x2="62" y2="74"/><line x1="212" y1="82" x2="278" y2="74"/>' +
    '<line x1="142" y1="126" x2="80" y2="140"/><line x1="198" y1="126" x2="260" y2="140"/>' +
    '<line x1="170" y1="134" x2="170" y2="172"/><line x1="170" y1="172" x2="150" y2="196"/><line x1="170" y1="172" x2="190" y2="196"/>' +
    '<line x1="128" y1="82" x2="112" y2="104"/><line x1="212" y1="82" x2="228" y2="104"/></g>' +
    '<g class="art" stroke-width="4"><polygon fill="none" points="158,46 182,46 212,82 198,126 170,134 142,126 128,82"/></g>' +
    '<circle class="artf" cx="128" cy="82" r="5"/><circle class="artf" cx="212" cy="82" r="5"/>' +
    '<text class="tx" text-anchor="middle" x="170" y="40">前交通</text>' +
    '<text class="tx" x="196" y="62">A1</text><text class="tx" text-anchor="end" x="196" y="108">後交通</text><line class="lt" x1="197" y1="104" x2="204" y2="104"/><text class="tx" x="186" y="146">P1</text>' +
    '<text class="tx" x="232" y="100">內頸動脈</text>' +
    '<text class="tb" x="192" y="20">前大腦 ACA</text><text class="tb" x="270" y="66" text-anchor="middle">中大腦 MCA</text>' +
    '<text class="tb" x="262" y="156" text-anchor="middle">後大腦 PCA</text>' +
    '<text class="tx" x="176" y="164">基底動脈</text><text class="tx" x="196" y="194">椎動脈</text>' +
    '<text class="tm" x="6" y="20">前循環</text><text class="tm" x="6" y="32">（內頸動脈）</text>' +
    '<text class="tm" x="6" y="176">後循環</text><text class="tm" x="6" y="188">（椎—基底動脈）</text>' +
    '</svg>';
  var S7 = '<ul><li><b>前循環</b>：主動脈 → 總頸動脈 → 內頸動脈 → 前大腦動脈、中大腦動脈。</li>' +
    '<li><b>後循環</b>：主動脈 → 鎖骨下動脈 → 椎動脈 → 基底動脈 → 後大腦動脈。</li></ul>' +
    fig(SVG7, '示意，底面觀。粗線＝成環的五段；細線不屬於環。') +
    '<ul><li><b>Willis 環</b>由五段圍成：前交通動脈、A1、內頸動脈末段、後交通動脈、P1。中大腦動脈不屬於環。</li>' +
    '<li><b>椎—基底系統</b>：兩條椎動脈在橋腦下緣匯成基底動脈。PICA 是椎動脈最大的分支；基底動脈依序發出 AICA、橋腦枝、SCA，末端分成兩條後大腦動脈。</li></ul>' +
    '<div class="tw"><table><tr><th>動脈</th><th>大腦皮質供應區</th></tr>' +
    '<tr><td>前大腦動脈 ACA</td><td>內側面，額葉到前頂葉</td></tr>' +
    '<tr><td>中大腦動脈 MCA</td><td>外側面的大部分</td></tr>' +
    '<tr><td>後大腦動脈 PCA</td><td>顳葉下內側與枕葉</td></tr></table></div>' +
    '<ul><li><b>淺靜脈</b>：Trolard 靜脈 → 上矢狀竇；Labbé 靜脈 → 橫竇；大腦中淺靜脈 → 海綿竇。</li>' +
    '<li><b>深靜脈</b>：大腦內靜脈＋基底靜脈 → Galen 大靜脈 → 直竇 → 竇匯。</li>' +
    '<li>深、淺靜脈最後都經硬膜靜脈竇流到頸內靜脈。</li></ul>' +
    demos([d("v", "v09_overview", "前後循環總覽"), d("v", "v09_willis", "Willis 環"), d("v", "v09_terr", "供應區"), d("v", "v09_post", "後循環"), d("v", "v09_v_sup", "淺靜脈"), d("v", "v09_v_deep", "深靜脈")]);

  /* ---------- 8 腦膜 ---------- */
  var SVG8 = '<svg viewBox="0 0 340 200" role="img" aria-label="腦膜分層示意，由外到內">' +
    '<rect x="8" y="8" width="190" height="26" fill="var(--bone)" stroke="var(--ink)" stroke-width="1"/>' +
    '<rect x="8" y="36" width="190" height="14" fill="#9a7b5c" fill-opacity=".55" stroke="var(--ink)" stroke-width="1"/>' +
    '<rect x="8" y="50" width="190" height="14" fill="#9a7b5c" fill-opacity=".35" stroke="var(--ink)" stroke-width="1"/>' +
    '<path class="venf" d="M88,50 L118,50 L103,66 Z" stroke="var(--ink)" stroke-width="1"/>' +
    '<circle class="artf" cx="40" cy="35" r="4" stroke="var(--ink)" stroke-width=".8"/>' +
    '<rect x="8" y="64" width="190" height="6" fill="#c9a227" fill-opacity=".5" stroke="var(--ink)" stroke-width=".8"/>' +
    '<rect x="8" y="70" width="190" height="10" fill="#8e6bd1" fill-opacity=".45" stroke="var(--ink)" stroke-width="1"/>' +
    '<rect x="8" y="80" width="190" height="42" class="csf"/>' +
    '<path class="lt" d="M30,80 L38,122 M64,80 L56,122 M132,80 L140,122 M170,80 L162,122"/>' +
    '<circle class="artf" cx="96" cy="106" r="5"/><circle class="venf" cx="150" cy="100" r="5"/>' +
    '<rect x="8" y="122" width="190" height="5" fill="#3d8f47" fill-opacity=".6" stroke="var(--ink)" stroke-width=".8"/>' +
    '<rect x="8" y="127" width="190" height="40" class="gm"/>' +
    '<g class="tx"><text x="206" y="25">顱骨</text><text x="206" y="45">硬膜：骨膜層</text><text x="206" y="59">硬膜：腦膜層</text>' +
    '<text x="206" y="73">硬膜邊界細胞層</text><text x="206" y="87">蜘蛛膜（屏障細胞層）</text>' +
    '<text x="206" y="105">蜘蛛膜下腔</text><text x="206" y="132">軟膜</text><text x="206" y="152">腦</text></g><path class="lt" d="M198,67 L204,69 M198,75 L204,83 M198,124.5 L204,128"/>' +
    '<text class="tm" x="206" y="118">CSF、小樑、血管</text>' +
    '<text class="tm" x="8" y="182">紅點：中腦膜動脈（顱骨與硬膜之間）。</text><text class="tm" x="8" y="195">藍三角：硬膜靜脈竇（硬膜兩層之間）。</text>' +
    '</svg>';
  var S8 = '<p><b>由外到內</b>：顱骨 → 硬膜骨膜層 → 硬膜腦膜層 → 硬膜邊界細胞層 → 蜘蛛膜（屏障細胞層）→ 蜘蛛膜下腔 → 軟膜 → 腦。</p>' +
    fig(SVG8, '示意，厚度不是實際比例。') +
    '<ul><li><b>名稱</b>：硬膜＝pachymeninx；蜘蛛膜＋軟膜＝leptomeninges。</li>' +
    '<li><b>硬膜兩層</b>大部分貼在一起，在硬膜靜脈竇的地方分開。腦膜層向內摺成皺褶：大腦鐮、小腦天幕、小腦鐮、鞍膈。</li>' +
    '<li><b>蜘蛛膜</b>的屏障細胞層有 tight junction，把 CSF 擋在蜘蛛膜下腔。</li>' +
    '<li><b>硬膜下腔</b>正常不存在；出血時是從硬膜邊界細胞層撕開。</li>' +
    '<li><b>硬膜外腔</b>：顱內是潛在腔（硬膜貼著顱骨）；脊髓的硬膜外腔是真的空間。</li></ul>' +
    '<div class="tw"><table><tr><th>出血</th><th>血在哪一層</th><th>來源血管</th></tr>' +
    '<tr><td>硬膜外血腫</td><td>顱骨與硬膜骨膜層之間</td><td>中腦膜動脈</td></tr>' +
    '<tr><td>硬膜下血腫</td><td>硬膜邊界細胞層</td><td>橋靜脈</td></tr>' +
    '<tr><td>蜘蛛膜下腔出血</td><td>蜘蛛膜下腔</td><td>蜘蛛膜下腔裡的動脈</td></tr></table></div>' +
    demos([d("v", "v_mening", "腦膜分層"), d("v", "v_dura", "硬膜皺褶與靜脈竇"), d("p", "meninx_layers", "由外到內逐層"), d("p", "dural_sinus", "靜脈竇流向")]);

  var SECS = [
    { t: "方位詞與座標", h: S1 }, { t: "中樞神經系統分區", h: S2 }, { t: "灰質與白質", h: S3 }, { t: "顱神經功能成分與核柱", h: S4 },
    { t: "傳導路徑：三級神經元與交叉", h: S5 }, { t: "腦室與腦脊髓液", h: S6 }, { t: "血管供應總覽", h: S7 }, { t: "腦膜分層", h: S8 }
  ];

  var box0 = null, api = null, cur = 0;
  function render() {
    var s = SECS[cur], nav = "";
    for (var i = 0; i < SECS.length; i++) nav += '<button type="button" data-i="' + i + '" aria-current="' + (i === cur) + '" title="' + SECS[i].t + '" aria-label="第 ' + (i + 1) + ' 節：' + SECS[i].t + '">' + (i + 1) + '</button>';
    box0.innerHTML = '<div class="bnav" role="navigation" aria-label="基礎概念章節">' + nav + '</div>' +
      '<div class="bsec"><h3>' + (cur + 1) + '. ' + s.t + '</h3>' + s.h + '</div>' +
      '<div class="bstep"><button type="button" data-go="' + (cur - 1) + '"' + (cur ? "" : " disabled") + '>‹ 上一節</button>' +
      '<button type="button" class="pri" data-go="' + (cur + 1) + '"' + (cur < SECS.length - 1 ? "" : " disabled") + '>下一節 ›</button></div>';
    box0.querySelectorAll(".bnav button").forEach(function (b) { b.onclick = function () { go(+b.dataset.i, true); }; });
    box0.querySelectorAll(".bstep button").forEach(function (b) { b.onclick = function () { go(+b.dataset.go, true); }; });
    box0.querySelectorAll(".bdemo").forEach(function (b) {
      if (api && api.has && !api.has(b.dataset.k, b.dataset.id)) { b.remove(); return; }
      b.onclick = function () { runDemo(b); };
    });
    if (act) box0.querySelectorAll(".bdemo").forEach(function (b) { if (b.dataset.k === act.k && b.dataset.id === act.id) mark(b, act.r); });
  }
  // act＝目前由基礎概念切過去的那一顆（換節再回來時把亮燈和訊息補回去）
  var act = null;
  function mark(b, r) {
    var wrap = b.closest(".bdemos"), msg = wrap.querySelector(".bmsg");
    wrap.querySelectorAll(".bdemo").forEach(function (x) { x.classList.toggle("on", x === b); });
    msg.hidden = false;
    msg.innerHTML = '<span>模型已切到：<b></b></span>' + (r.guide ? '<button type="button" data-a="guide">看步驟與說明（導覽）</button>' : '') + '<button type="button" data-a="back">回一般顯示</button>';
    msg.querySelector("b").textContent = r.name || "";
    msg.querySelectorAll("button").forEach(function (x) {
      x.onclick = function () {
        if (x.dataset.a === "guide") { if (api.tab) api.tab("guide"); return; }
        api.demo("", ""); unmark();
      };
    });
  }
  function unmark() {
    act = null;
    if (box0) { box0.querySelectorAll(".bdemo.on").forEach(function (y) { y.classList.remove("on"); }); box0.querySelectorAll(".bmsg").forEach(function (m) { m.hidden = true; }); }
    if (api && api.changed) api.changed();
  }
  function runDemo(b) {
    if (!api || !api.demo) return;
    var k = b.dataset.k, id = b.dataset.id, r = api.demo(k, id);
    if (k === "t") return;            // 只切分頁，模型沒動
    if (!r) { unmark(); return; }
    act = { k: k, id: id, r: r }; mark(b, r);
    if (api.changed) api.changed();
  }
  // 模型被別處切走（左欄清單、↺、全部重設、換課程）時，把「模型已切到」訊息和亮著的鈕收掉；v＝目前課本視角的值、pv＝目前路徑
  function sync(v, pv) {
    if (!act) return;
    if (act.k === "p" ? pv === act.id : v === act.id || v === "v:" + act.id) return;
    unmark();
  }
  function go(i, save) {
    if (!(i >= 0 && i < SECS.length)) return;
    cur = i;
    if (save) { try { localStorage.setItem(KEY, String(i)); } catch (e) {} }
    render();
    var sc = (api && api.scroller) || box0.parentElement; if (sc) sc.scrollTop = 0;
  }
  function init(el, a) {
    box0 = el; api = a || {};
    if (!document.getElementById("basicsCss")) { var st = document.createElement("style"); st.id = "basicsCss"; st.textContent = CSS; document.head.appendChild(st); }
    try { var v = localStorage.getItem(KEY); if (v !== null && +v >= 0 && +v < SECS.length) cur = +v; } catch (e) {}
    render();
  }
  window.BASICS = { init: init, go: go, sync: sync, active: function () { return !!act; }, n: function () { return SECS.length; }, cur: function () { return cur; }, SECS: SECS };
})();
