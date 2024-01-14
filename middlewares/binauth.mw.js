const BinService = require('../services/bin.service');
const EncryptionService = require('../services/encryption.service');

module.exports = async (req, res, next) => {
  let chipId = req.header('x-chip-id');
  if (!chipId) return res.fail('Unauthorized');
  chipId = EncryptionService.decryptStringWith3DES(chipId, process.env.BIN_ENCRYPTION_KEY);

  if (isNaN(chipId)) {
    return res.fail('Unauthorized');
  }

  const foundBin = await BinService.findByChipId(chipId, true);
  // console.log(foundBin);

  if (!foundBin) {
    return res.fail('Unauthorized');
  }

  req.bin = foundBin;
  return next();
};
