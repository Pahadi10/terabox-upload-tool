function createFolder(パス, bdstoken, app_id, jsToken) {
    const url = `https://www.terabox.com/api/create?a=commit&bdstoken=${bdstoken}&app_id=${app_id}&web=1&channel=dubox&clienttype=0&jsToken=${jsToken}&dp-logid=46452600984514820032`;
    
    const data = new URLSearchParams({
        path: パス,
        isdir: 1,
        block_list: "[]"
    });

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data.toString(),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// 使用例
createFolder("/a", "43bfe2c66a09d4e4561d68d6f4f10340", "250528", "3F3649BB89A2A6A09BB50936F9C72BF1D8AD957C2C90DFD89F8213A3150FB8BCCDEB94CC4F3F3D863287FE9BCA60922AF06C81F36045A823C1DD16CF69961185");
