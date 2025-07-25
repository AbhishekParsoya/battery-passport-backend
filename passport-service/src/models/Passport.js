const mongoose = require('mongoose');

const passportSchema = new mongoose.Schema({
  data: {
    generalInformation: {
      batteryIdentifier: String,
      batteryModel: {
        id: String,
        modelName: String
      },
      batteryMass: Number,
      batteryCategory: String,
      batteryStatus: String,
      manufacturingDate: String,
      manufacturingPlace: String,
      warrantyPeriod: String,
      manufacturerInformation: {
        manufacturerName: String,
        manufacturerIdentifier: String
      }
    },
    materialComposition: {
      batteryChemistry: String,
      criticalRawMaterials: [String],
      hazardousSubstances: [
        {
          substanceName: String,
          chemicalFormula: String,
          casNumber: String
        }
      ]
    },
    carbonFootprint: {
      totalCarbonFootprint: Number,
      measurementUnit: String,
      methodology: String
    }
  }
});

module.exports = mongoose.model('Passport', passportSchema);
