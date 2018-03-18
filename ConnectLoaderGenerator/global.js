"use strict";

window.addEventListener('load', function() {
    const classShowConnectLoader = `show-connect-loader`;

    const classWrapper = `conload-wrapper`;
    const classInnerText = `conload-inner-text`;
    const classItems = `conload-items`;
    const classItem = `conload-item`;

    const DOMWrapper = document.querySelector(`.${classWrapper}`);
    const DOMItems = DOMWrapper.querySelector(`.${classItems}`);

    const DOMItemTemplate = document.createElement('div');
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
    const Updatable = {
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

    const DOMItemCount = document.querySelector('input.item-count');
    const DOMItemSize = document.querySelector('input.item-size');
    const DOMItemRushSize = document.querySelector('input.item-rush-size');
    const DOMItemBorderRadius = document.querySelector('input.item-border-radius');
    const DOMItemSizeChangeCount = document.querySelector('input.item-size-change-count');
    const DOMAnimDuration = document.querySelector('input.anim-duration');
    const DOMAnimDelay = document.querySelector('input.anim-delay');
    const DOMMoveRadius = document.querySelector('input.move-radius');
    const DOMKeyframesSteps = document.querySelector('input.keyframes-steps');
    const DOMAnimReverse = document.querySelector('input.anim-reverse');
    const DOMAnimFL2R = document.querySelector('input.anim-fl2r');
    const DOMOutputHTML = document.querySelector('textarea.output-html');
    const DOMOutputCSS = document.querySelector('textarea.output-css');
    const DOMShowConnectLoader = document.querySelector('input.show-connect-loader');
    const DOMOutputCSSStyle = document.querySelector('style.output-css');

    const Settings = {
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

    DOMOutputHTML.addEventListener('click', Copy2Clipboard);
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
            clearTimeout(UpdateTimeout);

            UpdateTimeout = setTimeout(function() {
                UpdateTimeout = null;
                Update();
            }, 1000);

            return;
        }

        var PI2 = Math.PI * 2;
        var PI_2 = Math.PI / 2;

        var outputcss = [ '@charset "UTF-8";', '' ];

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

        outputcss.push(`/**`);
        outputcss.push(` * Author: MaxQNEI <maxqnei@gmail.com>`);
        outputcss.push(` *`);
        outputcss.push(` * Generated in http://untitled.audiowars.space/connect-loader-generator.html`);
        outputcss.push(` * Generation date: ${(new Date).toLocaleString()}`);
        outputcss.push(` *`);
        outputcss.push(` * Settings:`);
        outputcss.push(` * Element Count:            ${itemCount}`);
        outputcss.push(` * Element Size:             ${itemSize}px`);
        outputcss.push(` * Element RushSize:         ${itemRushSize}px`);
        outputcss.push(` * Element BorderRadius:     ${itemRushSize}px`);
        outputcss.push(` * Element SizeChangeCount:  ${itemRushSize}px`);
        outputcss.push(` * Animation Duration:       ${animDuration*1e3}ms`);
        outputcss.push(` * Animation Delay:          ${animDelay*1e3}ms`);
        outputcss.push(` * Move Radius:              ${moveRadius}px`);
        outputcss.push(` * Keyframes Steps:          ${keyframesSteps}ms`);
        outputcss.push(` * Animation Reverse:        ${animReverse?'Enabled':'Disabled'}`);
        outputcss.push(` * Animation FromLeft2Right: ${animFL2R?'Enabled':'Disabled'}`);
        outputcss.push(` */`);

        outputcss.push(`.${classWrapper} {`);
        outputcss.push(`    position: absolute;`);
        outputcss.push(`    top: -100%;`);
        outputcss.push(`    left: -100%;`);
        outputcss.push(`    right: 0;`);
        outputcss.push(`    bottom: 0;`);
        outputcss.push(`    z-index: 100000;`);
        outputcss.push(`    width: 100%;`);
        outputcss.push(`    height: 100%;`);
        outputcss.push(`    background-color: rgba(255, 255, 255, 0.9);`);
        outputcss.push(`    opacity: 0;`);
        outputcss.push(`    cursor: default;`);
        outputcss.push(``);
        outputcss.push(`    /* FadeOut */`);
        outputcss.push(`    transition:`);
        outputcss.push(`        top 0.01s linear 0.31s,`);
        outputcss.push(`        left 0.01s linear 0.31s,`);
        outputcss.push(`        opacity 0.3s ease-out;`);
        outputcss.push(`}`);
        outputcss.push(``);

        outputcss.push(`body.${classShowConnectLoader} .${classWrapper} {`);
        outputcss.push(`    top: 0;`);
        outputcss.push(`    left: 0;`);
        outputcss.push(`    opacity: 1;`);
        outputcss.push(``);
        outputcss.push(`    /* FadeIn */`);
        outputcss.push(`    transition:`);
        outputcss.push(`        top 0.01s linear,`);
        outputcss.push(`        left 0.01s linear,`);
        outputcss.push(`        opacity 0.3s ease-out 0.01s;`);
        outputcss.push(`}`);
        outputcss.push(``);

        outputcss.push(`.${classWrapper} .${classInnerText} {`);
        outputcss.push(`    position: absolute;`);
        outputcss.push(`    top: calc(50% - 18px);`);
        outputcss.push(`    left: calc(50% - 67px);`);
        outputcss.push(`    z-index: 100000;`);
        outputcss.push(`    width: 134px;`);
        outputcss.push(`    height: 36px;`);
        outputcss.push(`    padding: 8px 4px;`);
        outputcss.push(`    text-align: center;`);
        outputcss.push(`}`);
        outputcss.push(``);

        outputcss.push(`.${classWrapper} .${classItems} .${classItem} {`);
        outputcss.push(`    position: absolute;`);
        outputcss.push(`    top: -100%;`);
        outputcss.push(`    left: -100%;`);
        outputcss.push(`    z-index: 100001;`);
        outputcss.push(`    width: ${itemSize}px;`);
        outputcss.push(`    height: ${itemSize}px;`);
        outputcss.push(`    border-radius: ${itemSize * (itemBorderRadius / 100)}px;`);
        outputcss.push(`    background-color: #458ee9;`);
        outputcss.push(`    opacity: 0;`);
        outputcss.push(`    animation-name: ConnectLoaderItem;`);
        outputcss.push(`    animation-duration: ${animDuration}s;`);
        outputcss.push(`    animation-iteration-count: infinite;`);
        outputcss.push(`}`);
        outputcss.push(``);

        outputcss.push(`body.${classShowConnectLoader} .${classWrapper} .${classItems} .${classItem} {`);
        outputcss.push(`    opacity: 1;`);
        outputcss.push(`}`);
        outputcss.push(``);

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

        outputcss = outputcss.concat(a);
        outputcss = outputcss.concat(b);

        outputcss.push(`@keyframes ConnectLoaderItem {`);

        var percent = 0, _percent, normalPercent;
        var step = Math.PI / keyframesSteps;
        var end = PI2 + step - 0.0001;
        var eSize;

        if(animFL2R) {
            _percent = Math.min(PI2, percent);
            normalPercent = (_percent / PI2);
            eSize = (normalPercent * (itemRushSize - itemSize) + itemSize);

            outputcss.push(`    ${(normalPercent * 100).toFixed(4)}% {`)
            outputcss.push(`        width: ${eSize}px;`);
            outputcss.push(`        height: ${eSize}px;`);
            outputcss.push(`        border-radius: ${eSize * (itemBorderRadius / 100)}px;`);
            outputcss.push(`        transform: rotateZ(${Math.pow(_percent, Math.PI)}deg);`);
            outputcss.push(`        ${GenerateTop(PI_2, eSize, moveRadius)}`);
            outputcss.push(`        left: ${!animReverse ? -120 : 120}%`);
            outputcss.push(`    }`);
            outputcss.push(``);

            percent += step;
        }

        for(var endX = (animFL2R ? end * 2 - step : end); percent < endX; percent += step) {
            _percent = Math.min((animFL2R ? PI2 - step : PI2), percent);
            normalPercent = (_percent / PI2);
            eSize = (normalPercent * (itemRushSize - itemSize) + itemSize);

            outputcss.push(`    ${(normalPercent * 100).toFixed(4)}% {`)
            outputcss.push(`        width: ${eSize}px;`);
            outputcss.push(`        height: ${eSize}px;`);
            outputcss.push(`        border-radius: ${eSize * (itemBorderRadius / 100)}px;`);
            outputcss.push(`        transform: rotateZ(${Math.pow(_percent, Math.PI)}deg);`);
            outputcss.push(`        ${GenerateTop(_percent, eSize, moveRadius)}`);
            outputcss.push(`        ${GenerateLeft((animReverse ? _percent : -_percent), eSize, moveRadius)}`);
            outputcss.push(`    }`);
            outputcss.push(``);
        }

        if(animFL2R) {
            _percent = Math.min(PI2, percent);
            normalPercent = (_percent / PI2);
            eSize = (normalPercent * (itemRushSize - itemSize) + itemSize);

            outputcss.push(`    ${(normalPercent * 100).toFixed(4)}% {`)
            outputcss.push(`        width: ${eSize}px;`);
            outputcss.push(`        height: ${eSize}px;`);
            outputcss.push(`        border-radius: ${eSize * (itemBorderRadius / 100)}px;`);
            outputcss.push(`        transform: rotateZ(${Math.pow(_percent, Math.PI)}deg);`);
            outputcss.push(`        ${GenerateTop(PI_2, eSize, moveRadius)}`);
            outputcss.push(`        left: ${animReverse ? -120 : 120}%`);
            outputcss.push(`    }`);
            outputcss.push(``);
        }

        outputcss.pop();
        outputcss.push(`}`);

        if(!UpdateTimeout) {
            UpdateTimeout = setTimeout(function(outputcss, outputhtml) {
                UpdateTimeout = null;

                DOMOutputHTML.value = FormatHTML(outputhtml);

                DOMOutputCSS.value =
                DOMOutputCSSStyle.innerText =
                    outputcss
                ;
            }, 1000, MinifyCSS(`${outputcss.join(`\n`).trim()}\n`), DOMWrapper.outerHTML);
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

    function FormatHTML(html) {
        var fb = document.createElement('div');
        Object.assign(fb.style, {
            display: 'none'
        });
        fb.innerHTML = html;

        A(fb);

        function A(element, lvl) {
            lvl = (lvl !== undefined ? lvl : -1) + 1;
            var childs = element.children;
            B(element);
            for(var i = 0; i < childs.length; i++) {
                A(childs[i], lvl);
                C(childs[i], lvl);
            }
            element.outerHTML = `${element.outerHTML}\n${('').padStart((lvl-2)*4, ' ')}`;
        }

        function B(element) {
            var chnodes = element.childNodes;
            for(var i2 = 0; i2 < chnodes.length; i2++) {
                if(chnodes[i2].nodeName == '#text') {
                    chnodes[i2].textContent = chnodes[i2].textContent.trim();
                }
                
            }
            var childs = element.children;
            for(var i = 0; i < childs.length; i++) {
                B(childs[i]);
            }
        }

        function C(element, lvl,) {
            element.outerHTML = `\n${('').padStart(lvl*4, ' ')}${element.outerHTML}`;
            return element;
        }

        return window.xx = fb.innerHTML.trim().replace(/\n^(\s+)?$/gm, '');
    }

    function MinifyCSS(source) {
        var minified = source
            .replace(/\s{2,}/g, ' ')
            .replace(/\r?\n/g, '')
            .replace(/(\/\*.*?\*\/)/g, '')
            .replace(/([^ ]) (\{) ([^ ])?/g, '$1$2$3')
            .replace(/\: /g, ':')
            .replace(/; /g, ';')
            .replace(/\, /g, ',')
            .replace(/;\./g, '; .')
            .replace(/([^\d])[0]+(\.\d+)/g, '$1$2')
            .trim();
        ;

        return minified;
    }

    function Copy2Clipboard(event) {
        if(!(event instanceof Event)) {
            return;
        }

        this.selectionStart = 0;
        this.selectionEnd = this.value.length;
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
});
