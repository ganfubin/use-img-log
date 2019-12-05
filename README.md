# 找出项目中没有被使用的图片资源
> 由于前端在切图的时候，会出现把图片引入项目，后因为各种原因又没有使用这张图片，其他人维护的时候又不敢轻易的删除

> 现在只支持 .jpg .png .gif .svg格式文件


Using npm:
```
  npm install use-img-log --save -d

  "scripts": {
    "clean": "use-img-log"
  }


  npm run clean
```

### 获取项目全部文件
```javascript
  
  let files = fs.readdirSync(root);

```

### 获取项目中所有图片资源
```javascript
  
  let files = getFileImg(files, root);

  /**
 * 获取全部图片资源，以及图片路径
 * @param files
 * @param pathDir
 * @returns {Array}
 */
const getFileImg = (files, pathDir) => {
  let imgList = [];
  files.forEach((item) => {
    if (!notEachDirectory.includes(item)) {
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

```

### 标记被使用过的图片
```javascript
  
  findNotUseImg(files, root, imgList);

/**
 * 找到没有使用的图片
 * @param files
 * @param pathDir
 * @param imgList
 * @returns {*}
 */
const findNotUseImg = (files, pathDir, imgList) => {
  files.forEach((item) => {
    if (!notEachDirectory.includes(item)) {
      let pathItem = `${pathDir}/${item}`;
      let stat = fs.statSync(pathItem);
      if (stat.isDirectory()) {
        let pathItemFiles = fs.readdirSync(pathItem);
        let imgs = findNotUseImg(pathItemFiles, pathItem, imgList);
        imgList.concat(imgs)
      } else {
        let isImg = /\.jpg|\.png|\.gif|\.svg/gi.test(item);
        if (!isImg) {
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

```

