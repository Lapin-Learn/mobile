import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';

import { RankEnum } from '~/lib/enums';

export const useShare = () => {
  const rankImages = {
    [RankEnum.BRONZE]: require('~/assets/images/share/rank_bronze.png'),
    [RankEnum.SILVER]: require('~/assets/images/share/rank_silver.png'),
    [RankEnum.GOLD]: require('~/assets/images/share/rank_gold.png'),
    [RankEnum.PLATINUM]: require('~/assets/images/share/rank_platinum.png'),
    [RankEnum.DIAMOND]: require('~/assets/images/share/rank_diamond.png'),
    [RankEnum.MASTER]: require('~/assets/images/share/rank_master.png'),
  };

  const getImageUri = async (rank: RankEnum) => {
    try {
      const image = rankImages[rank];
      if (!image) {
        throw new Error(`No image found for rank ${rank}`);
      }

      const asset = Asset.fromModule(image);
      await asset.downloadAsync();

      if (!asset.localUri) {
        throw new Error('Failed to get local URI for asset');
      }

      return asset.localUri;
    } catch (error) {
      console.error('Error loading image:', error);
      throw error;
    }
  };

  const handleShare = async (rank: RankEnum) => {
    try {
      const uri = await getImageUri(rank);
      if (!uri) {
        throw new Error('Failed to get image URI');
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        alert('Sharing is not available on this platform');
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your milestone',
        UTI: 'public.png',
      });
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Error sharing image');
    }
  };

  return { handleShare };
};
