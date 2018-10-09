# 找出项目中没有被使用的图片资源
> 由于前端在切图的时候，会出现把图片引入项目，后因为各种原因又没有使用这张图片

> 现在只支持 .jpg .png .gif .svg格式文件
> 方法并不全部 ...

Using npm:
```
  npm install use-img-log

  "scripts": {
    "clean": "use-img-log"
  }


  npm run clean
```

