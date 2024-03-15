'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    setStatus(status, role = 'user') {
      if (!status) {
        return;
      }

      if (role === 'user') {
        if (this.status === 'moderation') {
          return;
        }
        if (!['active', 'inactive'].includes(status)) {
          return;
        }
      }

      if (status === 'active') {
        this.status = 'moderation';
        return;
      }

      this.status = status;
    }

    static associate() {

    }
  }
  Property.init(
    {
      url: DataTypes.STRING,
      revision: DataTypes.INTEGER,
      name: DataTypes.STRING,
      status: DataTypes.ENUM('active', 'inactive', 'moderation', 'rejected'),
      description: DataTypes.TEXT,
      rejectionReason: DataTypes.STRING,
      marketType: DataTypes.ENUM('secondary', 'primary'), // secondary or primary
      city: DataTypes.STRING, // tashkent
      district: DataTypes.STRING, // yunusobod
      street: DataTypes.STRING, // street name
      slug: DataTypes.STRING,
      labelIds: DataTypes.ARRAY(DataTypes.INTEGER),
      placeIds: DataTypes.ARRAY(DataTypes.STRING),
      polygons: DataTypes.ARRAY(DataTypes.INTEGER),
      totalViews: DataTypes.INTEGER,
      phoneGetCount: DataTypes.INTEGER,
      perSquarePrice: DataTypes.FLOAT,
      latlng: {
        type: DataTypes.GEOMETRY('POINT'),
        get() {
          const val = this.getDataValue('latlng');
          return val?.coordinates ? val.coordinates : null;
        },
        set(val) {
          if (val) {
            this.setDataValue('latlng', { type: 'Point', coordinates: val });
          }
        },
      },
      isPrivate: DataTypes.BOOLEAN,
      roomsCount: DataTypes.INTEGER,
      totalArea: DataTypes.FLOAT,
      livingArea: DataTypes.FLOAT,
      floor: DataTypes.INTEGER,
      totalFloors: DataTypes.INTEGER,
      buildType: DataTypes.STRING, // brick panel other
      layout: DataTypes.STRING,
      propertyType: DataTypes.STRING,
      bathroomCount: DataTypes.INTEGER,
      ceilingHeight: DataTypes.FLOAT,
      hasInternet: DataTypes.BOOLEAN,
      hasSwimmingPool: DataTypes.BOOLEAN,
      hasFurnishing: DataTypes.BOOLEAN,
      hasBalcony: DataTypes.BOOLEAN,
      hasSauna: DataTypes.BOOLEAN,
      hasSewage: DataTypes.BOOLEAN,
      hasElectricity: DataTypes.BOOLEAN,
      hasWater: DataTypes.BOOLEAN,
      hasGas: DataTypes.BOOLEAN,
      repair: DataTypes.STRING,
      constructionDate: DataTypes.STRING,
      price: DataTypes.INTEGER,
      rentPrice: DataTypes.INTEGER,
      rentType: DataTypes.STRING, // daily, monthly
      currency: DataTypes.ENUM('USD', 'UZS'),
      listingType: {
        type: DataTypes.VIRTUAL,
        get() {
          const rentPrice = this.getDataValue('rentPrice');
          return rentPrice ? 'rent' : 'sale';
        }
      }
    },
    {
      hooks: {
        beforeUpdate: (property, options) => {
          if (property.changed('city') || property.changed('district') || property.changed('slug') || property.changed('propertyType') || property.changed('id')) {
            property.url = `https://77kv.uz/${property.city}/${property.district}/${property.slug}/${property.propertyType}/${property.id}`;
          }
        },
        afterCreate: async (property, options) => {
          let { city, district, slug, propertyType, id, price, totalArea } = property;

          property.perSquarePrice = Math.round(price / totalArea) || null;

          if (city && id && district && slug && propertyType) {
            property.url = `${process.env.FRONT_HOST_NAME}/${city}/${district}/${slug}/${propertyType}/${id}`;
          }
          await property.save();
        },
      },
      sequelize,
      modelName: 'Property',
      underscored: true,
    }
  );

  return Property;
};
