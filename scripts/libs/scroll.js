class ScrollObserver {
    //引数：クラス、コールバック関数、オプション
    constructor(els, cb, options) {
        //.animate-titleクラスの全要素を取得
        this.els = document.querySelectorAll(els);
        //IntersectObserverのオプションを決定
        const defaultOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0,
            once: true
        };
        //コールバック関数をプロパティに追加
        this.cb = cb;
        //デフォルトオプションをプロパティのオプションに追加
        this.options = Object.assign(defaultOptions, options);
        //監視を1回に限定
        this.once = this.options.once;
        //初期化処理
        this._init();
    }
    _init() {
        //監視対象をTextAnimationのコールバック関数にセットする
        const callback = function (entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.cb(entry.target, true);
                    if(this.once) {
                        observer.unobserve(entry.target);
                    }
                } else {
                    this.cb(entry.target, false);
                }
            });
        };
        //ScrollObserverクラスのコールバック関数を引数にセット
        this.io = new IntersectionObserver(callback.bind(this), this.options);

        // @see https://github.com/w3c/IntersectionObserver/tree/master/polyfill
        this.io.POLL_INTERVAL = 100;
        //.animate-titleをforEachでループして、監視対象のelをobserveメソッドに渡す      
        this.els.forEach(el => this.io.observe(el));
    }

    destroy() {
        //監視を解除する
        this.io.disconnect();
    }
}