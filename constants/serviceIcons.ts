import { ImageSourcePropType } from 'react-native';

export type ServiceIconKey = 'laundry' | 'garments' | 'house' | 'car' | 'plumbing' | 'gardening' | 'electricity' | 'shop';

export const ServiceIcons: Record<ServiceIconKey, ImageSourcePropType> = {
  laundry: require('@/assets/images/icons/laundry.png'),
  garments: require('@/assets/images/icons/garments.png'),
  house: require('@/assets/images/icons/house.png'),
  car: require('@/assets/images/icons/car.png'),
  plumbing: require('@/assets/images/icons/plumbing.png'),
  gardening: require('@/assets/images/icons/gardening.png'),
  electricity: require('@/assets/images/icons/electricity.png'),
  shop: require('@/assets/images/icons/shop.png'),
};
