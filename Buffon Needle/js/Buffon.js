// js/buffon.js

class buffon {
  constructor(elm1, elm1b, elm2, elm2b, elmTheory, elmAnswer) {
    
    this.vc1     = new VCanvas(elm1);
    this.vc1b    = new VCanvas(elm1b);
    this.vc2     = new VCanvas(elm2);
    this.vc2b    = new VCanvas(elm2b);
    this.elmTheory = elmTheory;
    this.elmAnswer = elmAnswer;

    /*統計用の変数*/
    this.total = 0;
    this.hits  = 0;
    this.theory = Math.PI;
    this.elmTheory.innerHTML = "理論値：" + this.theory.toFixed(4);

    // 背景描画
    this.background();

    // タイマー・UI セットアップ
    this.setupTimer();
    this.setupUI();
  }

  background() {
    // ── 上キャンバスの背景
    this.vc1b.cls();
    this.vc1b.scale(0, 2, 1, -2);
    this.vc1b.forecolor(0,0,0);
    this.vc1b.beginPath();
    this.vc1b.line(0,0,1,0);
    this.vc1b.line(0,2,1,2);
    this.vc1b.stroke();
    this.vc1.cls();
    this.vc1.scale(0, 2, 1, -2);

    // ── 下キャンバスの背景（理論値を表示）
    const H = this.theory + 1;
    const MAX = 1000 // 横軸の表示範囲（試行回数上限）
    this.vc2b.cls();
    this.vc2b.scale(0, H, MAX, -H);
    this.vc2b.forecolor(0,0,0);
    this.vc2b.beginPath();
    this.vc2b.line(0, this.theory, MAX, this.theory);
    this.vc2b.stroke();

    this.vc2.cls();
    this.vc2.scale(0, H, MAX, -H);
    this.vc2.beginPath();
    this.vc2.lineStart(0,0);
    this.vc2.forecolor(200,0,50,0.4);
  }

  setupTimer() {
    this.timer = new vbTimer();
    this.timer.interval = 30;
    this.timer.timer = () => {
      // ランダムに針を落とす
      const y     = Math.random() * 2;            // 針の中心
      const theta = Math.random() * Math.PI;      // 角度 θ∈[0,π]
      const x0    = Math.random();                // x 中心 ∈[0,1]
      const dy    = 0.5 * Math.sin(theta);        // 針の半長さ=0.5
      const y1    = y + dy, y2 = y - dy;

      // ── 修正点：上下どちらかの線を跨いだらヒット
      const hit = (y1 > 2 || y2 < 0);

      // 針を描画
      this.vc1.beginPath();
      if (hit) this.vc1.forecolor(200,50,50,0.6);
      else     this.vc1.forecolor(50,50,200,0.6);
      this.vc1.line(x0, y1, x0, y2);
      this.vc1.stroke();

      // 統計更新
      this.total++;
      if (hit) this.hits++;
      const p   = this.hits / this.total;      // 当たり確率
      const est = 1 / p;                       // 推定 π

      // 収束グラフをプロット
      this.vc2.lineto(this.total, est);
      this.vc2.stroke();

      // テキスト更新
      this.elmAnswer.innerHTML = "計算値：" + est.toFixed(4);

      // 必要なら打ち切り
      if (this.total >= 10000) this.timer.disable();
    };
  }

  setupUI() {
    const nl = new nylon();
    nl.on("start", () => this.timer.enable());
    nl.on("clear", () => {
      this.timer.disable();
      this.total = this.hits = 0;
      this.elmAnswer.innerHTML = "計算値：0.0000";
      this.background();
    });
    document.getElementById("start")
            .addEventListener("click", () => nl.emit("start"));
    document.getElementById("clear")
            .addEventListener("click", () => nl.emit("clear"));
  }
}

// ページ読み込み後にシミュレータを起動
window.addEventListener("load", () => {
  new buffon(
    document.getElementById('graph1'),
    document.getElementById('graph1b'),
    document.getElementById('graph2'),
    document.getElementById('graph2b'),
    document.getElementById('theory'),
    document.getElementById('answer')
  );
});