async function getDownloadLink(fidlist, { jstoken, appid, sign, timestamp, bdstoken }) {
    const apiUrls = {
        sysCfg: 'https://www.terabox.com/api/getsyscfg',
        homeInfo: 'https://www.terabox.com/api/home/info',
        download: 'https://www.terabox.com/api/download'
    };

    const dpLogIds = {
        sysCfg: '18397400250736220038',
        homeInfo: '18397400250736220039',
        download: '18397400250736220040'
    };

    const appParams = {
        app_id: appid,
        web: '1',
        channel: 'dubox',
        clienttype: '0',
        jsToken: jstoken,
        version: '0',
        language_type: 'ja'
    };

    const downloadParams = {
        sign,
        timestamp,
        need_speed: '0',
        vip: '2',
        bdstoken
    };

    try {
        // sysCfg API
        const sysCfgResponse = await fetch(`${apiUrls.sysCfg}?${new URLSearchParams({
            ...appParams,
            'dp-logid': dpLogIds.sysCfg,
            cfg_category_keys: '[{"cfg_category_key":"web_download_to_pc_exp_flow_new","cfg_version":1},{"cfg_category_key":"web_download_to_pc","cfg_version":1}]'
        })}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const sysCfg = await sysCfgResponse.json();
        console.log('System Configuration:', sysCfg);

        // homeInfo API
        const homeInfoResponse = await fetch(`${apiUrls.homeInfo}?${new URLSearchParams({
            ...appParams,
            'dp-logid': dpLogIds.homeInfo
        })}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const homeInfo = await homeInfoResponse.json();
        console.log('Home Info:', homeInfo);

        // download API
        const downloadResponse = await fetch(`${apiUrls.download}?${new URLSearchParams({
            ...appParams,
            'dp-logid': dpLogIds.download,
            fidlist: JSON.stringify(fidlist),
            type: 'dlink',
            ...downloadParams
        })}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const downloadData = await downloadResponse.json();
        if (downloadData.dlink && downloadData.dlink.length > 0) {
            return downloadData.dlink[0].dlink;
        } else {
            throw new Error('Download link not found.');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// 使用例
(async () => {
    try {
        const fidlist = [217911186381995]; // ダウンロード対象のファイルIDリスト
        const params = {
            jstoken: '3F3649BB89A2A6A09BB50936F9C72BF1D8AD957C2C90DFD89F8213A3150FB8BCCDEB94CC4F3F3D863287FE9BCA60922AF06C81F36045A823C1DD16CF69961185',
            appid: '250528',
            sign: '9BIWaJUNH2mrAjROBAjPpwF0/WLwaTnXJEbm3pJV43xiH8fwL33T1g==',
            timestamp: '1738037365',
            bdstoken: '43bfe2c66a09d4e4561d68d6f4f10340'
        };

        const downloadLink = await getDownloadLink(fidlist, params);
        console.log('Download Link:', downloadLink);
    } catch (error) {
        console.error('Error:', error);
    }
})();
