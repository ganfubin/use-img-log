const fs = require('fs');
const path = require('path');
const chalk = require('chalk');


//不用遍历得文件
let notEachDirectory = ['package', 'node_modules', '.idea', '.gitignore', 'build', 'dist', '.git', '.nuxt'];


const showNotUseImgLog = () => {

    let root = process.cwd();

    //获取不用遍历得文件
    notEachDirectory = getNotEachDirectory(root, notEachDirectory);

    //获取项目全部文件
    let files = fs.readdirSync(root);

    //获取项目中所有
    let imgList = getFileImg(files, root);

    //标记被使用过的图片
    imgList = findNotUseImg(files, root, imgList);

    //去重
    imgList = uniq(imgList);

    //打印出没有使用过图片的日志路径
    let notUseImg = consoleNotUseImg(imgList);

    //退出进程
    process.exit((notUseImg && notUseImg.length > 0) ? 1 : 0);

};

/**
 * 获取不用遍历的文件
 * @param notEachDirectory
 * @returns {*}
 */
const getNotEachDirectory = (pathRoot, notEachDirectory) => {
    let iginorePath = `${pathRoot}/.gitignore`;
    let isExist =  fs.existsSync(iginorePath);
    if(isExist){
        let ignoreDirectory = fs.readFileSync(iginorePath, 'utf-8');
        notEachDirectory.push(...ignoreDirectory.match(/\w+/gi));
    }
    return notEachDirectory
};


/**
 * 获取全部图片资源，以及图片路径
 * @param files
 * @param pathDir
 * @returns {Array}
 */
const getFileImg = (files, pathDir) => {
    let imgList = [];
    files.forEach((item) => {
        if (notEachDirectory.indexOf(item) === -1) {
            let pathItem = `${pathDir}/${item}`;
            let stat = fs.statSync(pathItem);
            if (stat.isDirectory()) {
                imgList.push(...getFileImg(fs.readdirSync(pathItem), pathItem));
            } else {
                let isImg = /\.jpg|\.png|\.gif|\.svg/gi.test(item);
                if (isImg) {
                    imgList.push({
                        path: pathItem,
                        name: item
                    })
                }
            }
        }
    });
    return imgList;
};

/**
 * 找到没有使用的图片
 * @param files
 * @param pathDir
 * @param imgList
 * @returns {*}
 */
const findNotUseImg = (files, pathDir, imgList) => {
    files.forEach((item) => {
        if (notEachDirectory.indexOf(item) === -1) {
            let pathItem = `${pathDir}/${item}`;
            let stat = fs.statSync(pathItem);
            if (stat.isDirectory()) {
                let pathItemFiles = fs.readdirSync(pathItem);
                let imgs = findNotUseImg(pathItemFiles, pathItem, imgList);
                imgList.concat(imgs)
            } else {
                let isImg = /\.jpg|\.png|\.gif|\.svg/gi.test(item);
                if(!isImg){
                    let fileContext = fs.readFileSync(pathItem, 'utf-8');
                    imgList.forEach((list) => {
                        let isFindUse = fileContext.indexOf(list.name) === -1 ? false : true;
                        isFindUse && (list.isUse = true);
                    });
                }

            }
        }
    });
    return imgList;
};

/**
 * 去掉重复数据
 * @param imgList
 * @returns {*}
 */
const uniq = (imgList) => {
    let resultArr = [];
    imgList.forEach((item) => {
        let findItem = resultArr.find(d => {
            return d.path === item.path && d.name === item.name
        });
        if (!findItem) {
            resultArr.push(item)
        }
    });
    return resultArr
};

/**
 * 打印没有使用过的图片
 * @param imgList
 */
const consoleNotUseImg = (imgList) => {
    let findNotUseImg = imgList.filter((item) => { return !item.isUse});
    if(findNotUseImg && findNotUseImg.length > 0) {
        findNotUseImg.forEach((item) => {
            console.log("未被使用 =>" +chalk.red.underline(`${item.path}`))

        })
    }
    return findNotUseImg
};

showNotUseImgLog();





