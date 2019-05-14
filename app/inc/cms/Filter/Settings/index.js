/**
 * Created by WareBare on 3/24/2017.
 */


module.exports = {
    SubPageName: `Settings`,
    Forms: {},
    tplContent: {

    },
    

    Init: function(){},

    OnSubmitForm_GdPath: function(el){
        //Log(el.value);
        appConfig.set(`GrimDawn.Paths.Game`, el.value);
        Super.Init();

        wzReloadCMS(10);
    },
    OnSubmitForm_GdPathAdd: function(el){
        appConfig.set(`GrimDawn.Paths.UserData`, el.value);
        Super.Init();

        wzReloadCMS(10);
    },

    OnSubmitForm_bUseLanguage: function(el){
        appConfig.set(`Filter.bUseLocale`, el.checked);

        Super.InitData();

        wzReloadCMS(10);
    },

    OnSubmitForm_bZipChanges: function(el){
        appConfig.set(`Filter.bZipChanges`, el.checked);

        //Super.InitData();

        wzReloadCMS(10);
    },

    OnSubmitForm_SelectLanguage: function(el){
        //Log(el.value);
        appConfig.set(`Filter.LocaleFileName`, el.value);

        Super.InitData();

        wzReloadCMS(10);
    },

    OnSubmitForm_bEnableSymbols: function(el){
        appConfig.set(`Filter.bEnableSymbols`, el.checked);

        wzReloadCMS(10);
    },

    OnClickCheckBox_bMakeZipForTextEn: function(el){
        appConfig.set(`Filter.bMakeZipForTextEn`, el.checked);

        wzReloadCMS(10);
    },

    MakeContentForLocaleManagement: function(){
        let outStr = ``
            , tempFormItemOutput = ``;

        //
        tempFormItemOutput = ``;
        tempFormItemOutput += Super.tplContent.CheckBox.wzReplace({
            TEXT: Super.GetGrimDawnPath()
            , ON_CLICK_FN: `_cms.OnSubmitForm_bUseLanguage(this)`
            , LABEL: `Use Localization`
            , B_CHECKED: (Super.IsUsingLocale()) ? ` CHECKED` : ``
        });

        if(Super.IsUsingLocale()){

            let localeContents = fs.readdirSync(`${Super.Paths.Locale}`)
                , localeZips = []
                , localeDefs
                , localeOptions = [];


            for(let localeIndex in localeContents){
                if(localeContents[localeIndex].endsWith(`.zip`) && !localeContents[localeIndex].endsWith(`_C_.zip`)){
                    localeZips.push(localeContents[localeIndex]);
                }
            }
            localeDefs = Super.MakeLocaleDefs(localeZips);
            for(let defIndex in localeDefs){
                localeOptions.push({
                    TEXT: localeDefs[defIndex].Language || localeDefs[defIndex].language
                    , VALUE: localeDefs[defIndex].ZipName
                    , TOOL_TIP: `Authors: ${localeDefs[defIndex].author || localeDefs[defIndex].Author}\nFilename: ${localeDefs[defIndex].ZipName}`
                    , B_CHECKED: (appConfig.get(`Filter.LocaleFileName`) === localeDefs[defIndex].ZipName) ? ` SELECTED` : ``
                });
            }
            //localeOptions = 
            if(localeOptions.length){
                tempFormItemOutput += Super.MakeForm_SelectBox({
                    LABEL: `Choose Language`
                    , ON_CHANGE_FN: `_cms.OnSubmitForm_SelectLanguage(this)`
                }, localeOptions);
            }else{
                tempFormItemOutput += `<div>Loading Localizations...</div>`;
            }

            if(typeof appConfig.get(`Filter.bZipChanges`) === `undefined`) appConfig.set(`Filter.bZipChanges`, true);

            tempFormItemOutput += ``;
            tempFormItemOutput += Super.tplContent.CheckBox.wzReplace({
                ON_CLICK_FN: `_cms.OnSubmitForm_bZipChanges(this)`
                , LABEL: `Zip Changes`
                , B_CHECKED: (appConfig.get(`Filter.bZipChanges`)) ? ` CHECKED` : ``
            });
        }

        outStr += Super.tplContent.FormContainer.wzReplace({
            TITLE: `Language`
            , CONTENTS: `${tempFormItemOutput}`
        });

        return outStr;
    },

    /**
     * ex New Filter, Delete Filter, Rename Filter, ...
     */
    MakeContentForFilterManagement: function(){
        let outStr = ``
            , tempFormItemOutput = ``;

        if(typeof appConfig.get(`Filter.bEnableSymbols`) === `undefined`) appConfig.set(`Filter.bEnableSymbols`, true);
        if(typeof appConfig.get(`Filter.bMakeZipForTextEn`) === `undefined`) appConfig.set(`Filter.bMakeZipForTextEn`, false);
        
        tempFormItemOutput += ``;
        tempFormItemOutput += Super.tplContent.CheckBoxWithTip.wzReplace({
            ON_CLICK_FN: `_cms.OnSubmitForm_bEnableSymbols(this)`
            , LABEL: `Enable Symbols`
            , B_CHECKED: (appConfig.get(`Filter.bEnableSymbols`)) ? ` CHECKED` : ``
            , TOOL_TIP: `<ul><li class="Msg_Warn">${(appConfig.get(`Filter.bEnableSymbols`)) ? `Add Symbols.` : `Not adding Symbols.`}</li><li>Symbols are used for sets and show as (S).</li></ul>`
        });
        
        tempFormItemOutput += Super.tplContent.CheckBoxWithTip.wzReplace({
            ON_CLICK_FN: `_cms.OnClickCheckBox_bMakeZipForTextEn(this)`
            , LABEL: `Create Zip`
            , B_CHECKED: (appConfig.get(`Filter.bMakeZipForTextEn`)) ? ` CHECKED` : ``
        , TOOL_TIP: `<ul><li class="Msg_Warn">${(appConfig.get(`Filter.bMakeZipForTextEn`)) ? `Creates Zip in addition to regular files.` : `Will not create Zip.`}</li><li>Creates a Zip for non-localized colors.</li><li class="Msg_Warn">Localizations have their own checkbox.</li></ul>`
        });

        outStr += Super.tplContent.FormContainer.wzReplace({
            TITLE: `Filter Overview`
            , CONTENTS: `${tempFormItemOutput}`
        });

        return outStr;
    },

    MakeContent_Default: function(){
        let outStr = ``
            , tempFormItemOutput = ``;

        tempFormItemOutput = ``;

        if(Super.IsPathCorrect()) {
            tempFormItemOutput += `<span class="formBTN" onclick="require('electron').shell.openExternal('${Super.GetGrimDawnPath()}')">Open in Explorer</span><br />`;
        }

        tempFormItemOutput += Super.tplContent.TextField.wzReplace({
            TEXT: Super.GetGrimDawnPath()
            , ON_CHANGE_FN: `_cms.OnSubmitForm_GdPath(this)`
            , LABEL: `Grim Dawn - Path`
            , SETTINGS: ` style="width: 750px;"`
            , ERROR_MSG: (Super.IsPathCorrect()) ? `` : `Path must be wrong!`
        });
        if(Super.IsPathCorrect() && !Super.IsUsingLocale()){
            tempFormItemOutput += Super.tplContent.TextFieldWithTip.wzReplace({
                TEXT: appConfig.get(`GrimDawn.Paths.UserData`) || ``
                , ON_CHANGE_FN: `_cms.OnSubmitForm_GdPathAdd(this)`
                , LABEL: `Grim Dawn - User Data Path [optional]`
                , SETTINGS: ` style="width: 750px;"`
                , TOOL_TIP: `<ul><li>Optional</li><li>Localizations are not affected by this.</li><li>This can be used if you are experiencing tag issues</li><li>Example: C:/Users/Ware/Documents/My Games/Grim Dawn</li></ul>`
                , ERROR_MSG: ``
            });
        }

        outStr += Super.tplContent.FormContainer.wzReplace({
            TITLE: `Settings`
            , CONTENTS: `${tempFormItemOutput}`
        });

        if(Super.IsPathCorrect()){
            outStr += this.MakeContentForLocaleManagement();
            outStr += `<br />`;
            outStr += this.MakeContentForFilterManagement();
        } 

        return outStr;
    },

    content_: function(InContentType){
        this.contentType = InContentType || this.contentType || `Default`;
        
        let Output = ``;
        
        Output += this.MakeContent_Default();
        
        return Output;
    },
    
    sidebarBtns_: function(){
        let outButtons = [];

        // ---

        return outButtons;
    },
    sidebarList_: function(){
        let outButtons = {};

        // ---

        return outButtons;
    }
    
};
