window.addEventListener('load', ConnectLoader);

function ConnectLoader() {
    if(!(this instanceof ConnectLoader)) {
        return new ConnectLoader;
    }

    var classShowConnectLoader = `show-connect-loader`;

    var classWrapper = `conload-wrapper`;
    var classInnerText = `conload-inner-text`;
    var classItems = `conload-items`;
    var classItem = `conload-item`;

    var DOMWrapper = document.querySelector(`.${classWrapper}`);
    var DOMItems = DOMWrapper.querySelector(`.${classItems}`);

    var DOMItemTemplate = document.createElement('div');
    DOMItemTemplate.classList.add(classItem);

    Object.defineProperties(DOMItems, {
        getItems: {
            enumerable: true,
            value: function() {
                return this.querySelectorAll(`.${classItem}`);
            }
        }
    });

    //
    var Updatable = {
        'item-count': {},
        'item-size': {},
        'item-rush-size': {},
        'item-border-radius': {},
        'item-size-change-count': {},
        'anim-duration': {},
        'anim-delay': {},
        'move-radius': {},
        'keyframes-steps': {},
        'anim-reverse': {},
        'anim-fl2r': {},
        'output-css': {},
        'show-connect-loader': {},
    };

    var DOMItemCount = document.querySelector('input.item-count');
    var DOMItemSize = document.querySelector('input.item-size');
    var DOMItemRushSize = document.querySelector('input.item-rush-size');
    var DOMItemBorderRadius = document.querySelector('input.item-border-radius');
    var DOMItemSizeChangeCount = document.querySelector('input.item-size-change-count');
    var DOMAnimDuration = document.querySelector('input.anim-duration');
    var DOMAnimDelay = document.querySelector('input.anim-delay');
    var DOMMoveRadius = document.querySelector('input.move-radius');
    var DOMKeyframesSteps = document.querySelector('input.keyframes-steps');
    var DOMAnimReverse = document.querySelector('input.anim-reverse');
    var DOMAnimFL2R = document.querySelector('input.anim-fl2r');
    var DOMOutputCSS = document.querySelector('textarea.output-css');
    var DOMShowConnectLoader = document.querySelector('input.show-connect-loader');
    var DOMOutputCSSStyle = document.querySelector('style.output-css');

    var Settings = {
        'item-count': parseFloat(DOMItemCount.value),
        'item-size': parseFloat(DOMItemSize.value),
        'item-rush-size': parseFloat(DOMItemRushSize.value),
        'item-border-radius': parseFloat(DOMItemBorderRadius.value),
        'item-size-change-count': parseFloat(DOMItemSizeChangeCount.value),
        'anim-duration': parseFloat(DOMAnimDuration.value),
        'anim-delay': parseFloat(DOMAnimDelay.value),
        'move-radius': parseFloat(DOMMoveRadius.value),
        'keyframes-steps': parseFloat(DOMKeyframesSteps.value),
        'anim-reverse': !!DOMAnimReverse.checked,
        'anim-fl2r': !!DOMAnimFL2R.checked,
        'show-connect-loader': !!DOMShowConnectLoader.checked,
    };

    var UpdateTimeout;

    DOMItemCount.addEventListener('input', OnInput);
    DOMItemSize.addEventListener('input', OnInput);
    DOMItemRushSize.addEventListener('input', OnInput);
    DOMItemBorderRadius.addEventListener('input', OnInput);
    DOMItemSizeChangeCount.addEventListener('input', OnInput);
    DOMAnimDuration.addEventListener('input', OnInput);
    DOMAnimDelay.addEventListener('input', OnInput);
    DOMMoveRadius.addEventListener('input', OnInput);
    DOMKeyframesSteps.addEventListener('input', OnInput);
    DOMAnimReverse.addEventListener('change', OnInput);
    DOMAnimFL2R.addEventListener('change', OnInput);
    DOMShowConnectLoader.addEventListener('change', OnInput);

    DOMOutputCSS.addEventListener('click', Copy2Clipboard);
    DOMShowConnectLoader.addEventListener('change', OnShowConnectLoaderChange);

    Update();
    ShowConnectLoader();

    function OnInput(event) {
        for(var i = 0, name; i < this.classList.length; i++) {
            name = this.classList[i];

            if(Settings.hasOwnProperty(name)) {
                switch(this.type) {
                    case 'number':
                        Settings[name] = parseFloat(this.value);
                        break;

                    case 'checkbox':
                        Settings[name] = !!this.checked;
                        break;

                    default:
                        Settings[name] = this.value.trim()
                        break;
                }

                Update();

                return;
            }
        }
    }

    function Update() {
        if(UpdateTimeout) {
            // console.log('Wait!');

            clearTimeout(UpdateTimeout);

            UpdateTimeout = setTimeout(function() {
                UpdateTimeout = null;
                Update();
            }, 1000);

            return;
        }

        var PI2 = Math.PI * 2;
        var PI_2 = Math.PI / 2;

        var output = [ '@charset "UTF-8";', '' ];

        DOMOutputCSSStyle.innerText = '';

        var itemSize = Settings['item-size'];
        var itemSize_2 = itemSize / 2;
        var itemRushSize = Settings['item-rush-size'];
        var itemRushSize_2 = itemRushSize / 2;
        var itemBorderRadius = Settings['item-border-radius'];
        var itemSizeChangeCount = Settings['item-size-change-count'];
        var startPosX = itemSize;
        var startPosY = itemSize;

        var itemCount = Settings['item-count'];
        var animDuration = Settings['anim-duration'] / 1e3;
        var animDelay = Settings['anim-delay'] / 1e3;
        var moveRadius = Settings['move-radius'];
        var keyframesSteps = Settings['keyframes-steps'];
        var animReverse = Settings['anim-reverse'];
        var animFL2R = Settings['anim-fl2r'];

        var DOMItemList = DOMItems.getItems();

        if(DOMItemList.length > itemCount) {
            for(var i = DOMItemList.length - 1; i >= itemCount; i--) {
                DOMItemList[i].parentElement.removeChild(DOMItemList[i]);
            }
        } else if(DOMItemList.length < itemCount) {
            for(var i = DOMItemList.length - 1; i < itemCount; i++) {
                DOMItems.appendChild(DOMItemTemplate.cloneNode(true));
            }
        }

        output.push(`/**`);
        output.push(` * Author: MaxQNEI <maxqnei@gmail.com>`);
        output.push(` *`);
        output.push(` * Generated in http://untitled.audiowars.space/connect-loader-generator.html`);
        output.push(` * Generation date: ${(new Date).toLocaleString()}`);
        output.push(` *`);
        output.push(` * Settings:`);
        output.push(` * Element Count:            ${itemCount}`);
        output.push(` * Element Size:             ${itemSize}px`);
        output.push(` * Element RushSize:         ${itemRushSize}px`);
        output.push(` * Element BorderRadius:     ${itemRushSize}px`);
        output.push(` * Element SizeChangeCount:  ${itemRushSize}px`);
        output.push(` * Animation Duration:       ${animDuration*1e3}ms`);
        output.push(` * Animation Delay:          ${animDelay*1e3}ms`);
        output.push(` * Move Radius:              ${moveRadius}px`);
        output.push(` * Keyframes Steps:          ${keyframesSteps}ms`);
        output.push(` * Animation Reverse:        ${animReverse?'Enabled':'Disabled'}`);
        output.push(` * Animation FromLeft2Right: ${animFL2R?'Enabled':'Disabled'}`);
        output.push(` */`);

        output.push(`.${classWrapper} {`);
        output.push(`    position: absolute;`);
        output.push(`    top: -100%;`);
        output.push(`    left: -100%;`);
        output.push(`    right: 0;`);
        output.push(`    bottom: 0;`);
        output.push(`    z-index: 100000;`);
        output.push(`    width: 100%;`);
        output.push(`    height: 100%;`);
        output.push(`    background-color: rgba(255, 255, 255, 0.9);`);
        output.push(`    opacity: 0;`);
        output.push(`    cursor: default;`);
        output.push(``);
        output.push(`    /* FadeOut */`);
        output.push(`    transition:`);
        output.push(`        top 0.01s linear 0.31s,`);
        output.push(`        left 0.01s linear 0.31s,`);
        output.push(`        opacity 0.3s ease-out;`);
        output.push(`}`);
        output.push(``);

        output.push(`body.${classShowConnectLoader} .${classWrapper} {`);
        output.push(`    top: 0;`);
        output.push(`    left: 0;`);
        output.push(`    opacity: 1;`);
        output.push(``);
        output.push(`    /* FadeIn */`);
        output.push(`    transition:`);
        output.push(`        top 0.01s linear,`);
        output.push(`        left 0.01s linear,`);
        output.push(`        opacity 0.3s ease-out 0.01s;`);
        output.push(`}`);
        output.push(``);

        output.push(`.${classWrapper} .${classInnerText} {`);
        output.push(`    position: absolute;`);
        output.push(`    top: calc(50% - 18px);`);
        output.push(`    left: calc(50% - 67px);`);
        output.push(`    z-index: 100000;`);
        output.push(`    width: 134px;`);
        output.push(`    height: 36px;`);
        output.push(`    padding: 8px 4px;`);
        output.push(`    text-align: center;`);
        output.push(`}`);
        output.push(``);

        output.push(`.${classWrapper} .${classItems} .${classItem} {`);
        output.push(`    position: absolute;`);
        output.push(`    top: -100%;`);
        output.push(`    left: -100%;`);
        output.push(`    z-index: 100001;`);
        output.push(`    width: ${itemSize}px;`);
        output.push(`    height: ${itemSize}px;`);
        output.push(`    border-radius: ${itemSize * (itemBorderRadius / 100)}px;`);
        output.push(`    background-color: #458ee9;`);
        output.push(`    opacity: 0;`);
        output.push(`    animation-name: ConnectLoaderItem;`);
        output.push(`    animation-duration: ${animDuration}s;`);
        output.push(`    animation-iteration-count: infinite;`);
        output.push(`}`);
        output.push(``);

        output.push(`body.${classShowConnectLoader} .${classWrapper} .${classItems} .${classItem} {`);
        output.push(`    opacity: 1;`);
        output.push(`}`);
        output.push(``);

        var a = [], b = [];

        for(var i = 0; i < itemCount; i++) {
            a.push(`.${classWrapper} .${classItems} .${classItem}:nth-child(${i+1}) {`);
            a.push(`    transition: opacity 0.3s ease-out ${((animDelay*i)).toFixed(3)}s;`);
            a.push(`    animation-delay: ${(animDelay*i).toFixed(3)}s;`);
            a.push(`}`);
            a.push(``);

            b.push(`body.${classShowConnectLoader} .${classWrapper} .${classItems} .${classItem}:nth-child(${i+1}) {`);
            b.push(`    transition: opacity 0.3s ease-out ${((animDelay*i)+0.05).toFixed(3)}s;`);
            b.push(`}`);
            b.push(``);
        }

        output = output.concat(a);
        output = output.concat(b);

        output.push(`@keyframes ConnectLoaderItem {`);

        var percent = 0, _percent, normalPercent;
        var step = Math.PI / keyframesSteps;
        var end = PI2 + step - 0.0001;
        var eSize;

        if(animFL2R) {
            _percent = Math.min(PI2, percent);
            normalPercent = (_percent / PI2);
            eSize = (normalPercent * (itemRushSize - itemSize) + itemSize);

            output.push(`    ${(normalPercent * 100).toFixed(4)}% {`)
            output.push(`        width: ${eSize}px;`);
            output.push(`        height: ${eSize}px;`);
            output.push(`        border-radius: ${eSize * (itemBorderRadius / 100)}px;`);
            output.push(`        transform: rotateZ(${Math.pow(_percent, Math.PI)}deg);`);
            output.push(`        ${GenerateTop(PI_2, eSize, moveRadius)}`);
            output.push(`        left: ${!animReverse ? -120 : 120}%`);
            output.push(`    }`);
            output.push(``);

            percent += step;
        }

        for(var endX = (animFL2R ? end * 2 - step : end); percent < endX; percent += step) {
            _percent = Math.min((animFL2R ? PI2 - step : PI2), percent);
            normalPercent = (_percent / PI2);
            eSize = (normalPercent * (itemRushSize - itemSize) + itemSize);

            output.push(`    ${(normalPercent * 100).toFixed(4)}% {`)
            output.push(`        width: ${eSize}px;`);
            output.push(`        height: ${eSize}px;`);
            output.push(`        border-radius: ${eSize * (itemBorderRadius / 100)}px;`);
            output.push(`        transform: rotateZ(${Math.pow(_percent, Math.PI)}deg);`);
            output.push(`        ${GenerateTop(_percent, eSize, moveRadius)}`);
            output.push(`        ${GenerateLeft((animReverse ? _percent : -_percent), eSize, moveRadius)}`);
            output.push(`    }`);
            output.push(``);
        }

        if(animFL2R) {
            _percent = Math.min(PI2, percent);
            normalPercent = (_percent / PI2);
            eSize = (normalPercent * (itemRushSize - itemSize) + itemSize);

            output.push(`    ${(normalPercent * 100).toFixed(4)}% {`)
            output.push(`        width: ${eSize}px;`);
            output.push(`        height: ${eSize}px;`);
            output.push(`        border-radius: ${eSize * (itemBorderRadius / 100)}px;`);
            output.push(`        transform: rotateZ(${Math.pow(_percent, Math.PI)}deg);`);
            output.push(`        ${GenerateTop(PI_2, eSize, moveRadius)}`);
            output.push(`        left: ${animReverse ? -120 : 120}%`);
            output.push(`    }`);
            output.push(``);
        }

        output.pop();
        output.push(`}`);

        if(!UpdateTimeout) {
            // console.log('Before!');

            UpdateTimeout = setTimeout(function(output) {
                UpdateTimeout = null;

                DOMOutputCSS.value =
                DOMOutputCSSStyle.innerText =
                    output
                ;
            }, 1000, MinifyCSS(`${output.join(`\n`).trim()}\n`));
        }
    }

    function GenerateTop(percent, eSize, radius) {
        var y = parseFloat(((Math.sin(percent + (Math.PI/2))) * radius).toFixed(4));
        return `top: calc(50% - ${eSize/2}px ${(y >= 0 ? `+ ${y}` : `- ${Math.abs(y)}`)}px);`;
    }

    function GenerateLeft(percent, eSize, radius) {
        var x = parseFloat(((Math.sin(percent)) * radius).toFixed(4));
        return `left: calc(50% - ${eSize/2}px ${(x >= 0 ? `+ ${x}` : `- ${Math.abs(x)}`)}px);`;
    }

    function MinifyCSS(source) {
        console.log('Source In:', source.length);

        var minified = window.MinCSS = source
            .replace(/\s{2,}/g, ' ')
            .replace(/\r?\n/g, '')
            .replace(/(\/\*.*?\*\/)/g, '')
            .replace(/([^ ]) (\{) ([^ ])?/g, '$1$2$3')
            .replace(/\: /g, ':')
            .replace(/; /g, ';')
            .replace(/\, /g, ',')
            .replace(/;\./g, '; .')
            // .replace(/(\d+)\.[0]+/g, '$1')
            .replace(/([^\d])[0]+(\.\d+)/g, '$1$2')
            // .replace(/ ?[\+\-] [0]+[\w\%]+/g, '')
            // .replace(/(\d+\.\d{8})\d+([\w\%])/g, '$1$2')
            // .replace(/(\d+\.\d*?)[0]+/g, '$1')
            .trim();
        ;

        console.log('Source Out:', minified.length);

        return minified;
    }

    function Copy2Clipboard(event) {
        if(!(event instanceof Event)) {
            return;
        }

        DOMOutputCSS.selectionStart = 0;
        DOMOutputCSS.selectionEnd = DOMOutputCSS.value.length;
        document.execCommand('copy');
    }

    function OnShowConnectLoaderChange(event) {
        ShowConnectLoader()
    }

    function ShowConnectLoader() {
        if(Settings['show-connect-loader']) {
            document.body.classList.add(classShowConnectLoader);
        } else {
            document.body.classList.remove(classShowConnectLoader);
        }
    }
}
