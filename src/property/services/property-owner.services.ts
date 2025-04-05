import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Property } from '../schemas/property.schema';
import { Model, Types } from 'mongoose';
import { CreatePropertyDto } from '../dtos/property-owners.dto';
import { omit } from 'lodash';

@Injectable()
export class PropertyOwnerPropertyManagementService {
  constructor(
    @InjectModel(Property.name)
    private readonly propertyModel: Model<Property>,
  ) {}

  async createProperty(propertyModel: CreatePropertyDto, owner: string) {
    const createProperty = new this.propertyModel({
      ...propertyModel,
      owner_id: new Types.ObjectId(owner),
    });
    const savedProperty = await createProperty.save();

    return sanitizePropertyObject(savedProperty);
  }

  updateProperty() {
    // Logic to update a property
  }

  deleteProperty() {
    // Logic to delete a property
  }

  getPropertyDetails() {
    // Logic to get property details
  }
}

export function sanitizePropertyObject(property: Property) {
  const omitProperties = ['createdAt', 'updatedAt', '__v', 'owner_id', '_id'];
  const sanitizedProperty = omit(property.toObject(), omitProperties);
  return sanitizedProperty;
}
