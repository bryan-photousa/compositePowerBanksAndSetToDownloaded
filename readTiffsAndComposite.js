const fs = require('fs'),
  gm = require('gm'),
  sharp = require('sharp'),
  moment = require('moment');
const compositeService = require('./services/composite.services');
const fsExtra = require('fs-extra')
const logger = require('./utilities/logger');



let powerbankDirectories = [
  'batch_downloaded_PowerBank_103',
  'batch_downloaded_PowerBank_104'
];

let twoUp = 1974;
let threeUp = twoUp * 2;
let fourUp = twoUp * 3;
let fiveUp = twoUp * 4;
let sixUp = twoUp * 5;

let homePath = `${__dirname}`;
let regex = /[.]tiff$/;
fs
  .readdirSync(`${homePath}`)
  .filter((f) => regex.test(f))
  .forEach((f) => fs.unlinkSync(homePath + '/' + f));

let nasPath = '/Volumes/nas/48/Zazzle/auto_print/openprint'; //current path for Mac //change to windows path in production
let today = moment().format('YYYY-MM-DD');

init = () => {
  logger.info(":::READ TIFFS AND COMPOSITE INITIALIZED:::")
  powerbankDirectories.forEach((value) => {
    let currReadDirectory;
    currReadDirectory = nasPath + '/' + value;
    fs.readdir(currReadDirectory, { withFileTypes: true }, (err, subdirs) => {

      if (!subdirs) {
        logger.info("NO POWERBANK DIRECTORIES FOUND IN " + JSON.stringify(currReadDirectory))
      } else {
        subdirs.forEach((dir) => {
          logger.info('SEARCHING FOR ' + JSON.stringify(value.split("_")[3]) + " IN " + JSON.stringify(dir.name))
          let tiffFiles = [];
          let orderDirectory = '';
          let filename = '';
          if (dir.isDirectory() && dir.name.includes(today)) {
            orderDirectory = currReadDirectory + '/' + dir.name;
            let imageDirectory;
            console.log("INSIDE" + JSON.stringify(orderDirectory))
            fs.readdir(orderDirectory, { withFileTypes: true }, (err, subdirs1) => {

              subdirs1.forEach((dir1) => {
                logger.info('SEARCHING FOR ' + JSON.stringify(value.split("_")[3]) + " IN " + JSON.stringify(dir1.name))

                let compositeId;

                if (dir1.name.includes('images')) {
                  imageDirectory = orderDirectory + '/' + dir1.name;
                  compositeId = dir1.name.split('_')[1].split('-')[0];
                  fs.readdir(imageDirectory, { withFileTypes: true }, (err, files) => {
                    files.forEach((file) => {
                      let eachFile = imageDirectory + '/' + file.name;
                      tiffFiles.push(eachFile);
                    })
                    Promise.all(tiffFiles).then(() => {
                      let quantity = tiffFiles.length
                      let promises = [];
                      let extension = '.tiff';
                      if (tiffFiles.length > 0) {
                        tiffFiles.forEach((value, index) => {
                          let id = value.split('/')[10].split('_')[0];
                          if (index !== tiffFiles.length - 1) {
                            filename += id + '_';
                          } else {
                            filename +=
                              id + '_' + value.split('/')[10].split('_')[1].split('.')[0] + "_" + quantity;
                          }
                          promises.push(index);
                        });
                      }
                      Promise.all(promises).then(() => {

                        let filepath = '';
                        filepath = filename + extension;
                        if (tiffFiles.length > 0) {
                          let artworksPath = tiffFiles[0].replace('images', 'artworks');
                          artworksPath = artworksPath.split('/');
                          artworksPath = artworksPath
                            .filter((element, index) => index < artworksPath.length - 1)
                            .join('/');
                          compositeImages(tiffFiles, filepath, artworksPath, compositeId);
                        }


                      }).catch(err => {
                        if (err) {
                          logger.info('')

                        }
                      });

                      compositeImages = (
                        tiffFiles,
                        filepath,
                        artworksPath,
                        compositeId
                      ) => {
                        logger.info("INITIALIZING COMPOSITE FOR " + JSON.stringify(tiffFiles.length) + " TIFF FILES.")
                        switch (tiffFiles.length) {
                          case 1:
                            gm()
                              .in('-page', '+0+0')
                              .in(tiffFiles[0])
                              .mosaic()
                              .write(`${filepath}`, function (err) {
                                logger.info('COMPOSITING COMPLETED.')
                                if (err) console.log(err);
                                addColorChannelAndWriteToDisk(
                                  filepath,
                                  artworksPath,
                                  compositeId,
                                  tiffFiles
                                );
                              });
                            break;
                          case 2:
                            gm()
                              .in('-page', '+0+0')
                              .in(tiffFiles[0])
                              .in('-page', `+${twoUp}`)
                              .in(tiffFiles[1])
                              .mosaic()
                              .write(`${filepath}`, function (err) {
                                logger.info('COMPOSITING COMPLETED.')
                                if (err) console.log(err);
                                addColorChannelAndWriteToDisk(
                                  filepath,
                                  artworksPath,
                                  compositeId,
                                  tiffFiles

                                );
                              });
                            break;

                          case 3:
                            gm()
                              .in('-page', '+0+0')
                              .in(tiffFiles[0])
                              .in('-page', `+${twoUp}`)
                              .in(tiffFiles[1])
                              .in('-page', `+${threeUp}`)
                              .in(tiffFiles[2])
                              .mosaic()
                              .write(`${filepath}`, function (err) {
                                logger.info('COMPOSITING COMPLETED.')
                                if (err) console.log(err);
                                addColorChannelAndWriteToDisk(
                                  filepath,
                                  artworksPath,
                                  compositeId,
                                  tiffFiles
                                );
                              });
                            break;

                          case 4:
                            gm()
                              .in('-page', '+0+0')
                              .in(tiffFiles[0])
                              .in('-page', `+${twoUp}`)
                              .in(tiffFiles[1])
                              .in('-page', `+${threeUp}`)
                              .in(tiffFiles[2])
                              .in('-page', `+${fourUp}`)
                              .in(tiffFiles[3])
                              .mosaic()
                              .write(`${filepath}`, function (err) {
                                logger.info('COMPOSITING COMPLETED.')
                                if (err) console.log(err);
                                addColorChannelAndWriteToDisk(
                                  filepath,
                                  artworksPath,
                                  compositeId,
                                  tiffFiles
                                );
                              });
                            break;

                          case 5:
                            gm()
                              .in('-page', '+0+0')
                              .in(tiffFiles[0])
                              .in('-page', `+${twoUp}`)
                              .in(tiffFiles[1])
                              .in('-page', `+${threeUp}`)
                              .in(tiffFiles[2])
                              .in('-page', `+${fourUp}`)
                              .in(tiffFiles[3])
                              .in('-page', `+${fiveUp}`)
                              .in(tiffFiles[4])
                              .mosaic()
                              .write(`${filepath}`, function (err) {
                                logger.info('COMPOSITING COMPLETED.')
                                if (err) console.log(err);
                                addColorChannelAndWriteToDisk(
                                  filepath,
                                  artworksPath,
                                  compositeId,
                                  tiffFiles
                                );
                              });
                            break;

                          case 6:
                            gm()
                              .in('-page', '+0+0')
                              .in(tiffFiles[0])
                              .in('-page', `+${twoUp}`)
                              .in(tiffFiles[1])
                              .in('-page', `+${threeUp}`)
                              .in(tiffFiles[2])
                              .in('-page', `+${fourUp}`)
                              .in(tiffFiles[3])
                              .in('-page', `+${fiveUp}`)
                              .in(tiffFiles[4])
                              .in('-page', `+${sixUp}`)
                              .in(tiffFiles[5])
                              .mosaic()
                              .write(`${filepath}`, function (err) {
                                logger.info('COMPOSITING COMPLETED.')
                                if (err) console.log(err);
                                addColorChannelAndWriteToDisk(
                                  filepath,
                                  artworksPath,
                                  compositeId,
                                  tiffFiles
                                );
                              });
                            break;
                        }
                      };
                    }).catch(err => {
                      if (err) {
                        logger.warn("ERROR AFTER TRAVERSING DIRECTORIES::: " + JSON.stringify(err))
                      }
                    });
                  });
                }
              });
            });
          } else {
            console.log('error')
          }

        });
      }
    });
  });
};

addColorChannelAndWriteToDisk = (filepath, artworksPath, compositeId, tiffFiles) => {
  logger.info("ADDING CMYK CHANNEL TO COMPOSITE")
  fs.readFile(`${filepath}`, function (err, file) {
    sharp(file).withMetadata({ density: 300 })
      .ensureAlpha()
      .toColourspace('cmyk')
      .tiff({ compression: 'lzw' })
      .toFile(`${artworksPath}/${compositeId}_${filepath}`, (err, result) => {
        logger.info("CMYK CHANNEL ADDED TO COMPOSITE @ 300 DPI " + `${artworksPath}/${compositeId}_${filepath}`)
        if (err) throw err;
        let newPath = ''
        tiffFiles.forEach(file => {
          let find = "downloaded"
          let re = new RegExp(find, 'g')
          newPath = file.replace(re, 'printed')
          let splitNewPath = newPath.split('/')
          splitNewPath.pop()

          let joinedNewPath = splitNewPath.join('/')
          if (!fs.existsSync(joinedNewPath)) {
            fs.mkdirSync(joinedNewPath, { recursive: true })
          }
          fsExtra.move(file, newPath, (err) => {
            if (err) {
              throw err
            }
          })

        })
        // compositeService.changeCompositeToDownloaded(compositeId).then((response) => {
        //   if (response) {
        //     logger.info("COMPOSITE ID: " + JSON.stringify(compositeId) + " RESPONSE FROM OP " + { response })

        //   }
        //   console.log("response: " + JSON.stringify(response));
        // });
      });
  });
};

init()