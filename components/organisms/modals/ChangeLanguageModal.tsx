import { Check, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import EnFlag from '~/assets/images/en-flag.svg';
import ViFlag from '~/assets/images/vi-flag.svg';
import { default as GlobalStyles, default as Styles } from '~/constants/GlobalStyles';
import i18n from '~/i18n';
import { GLOBAL_STYLES } from '~/lib/constants';

type ChangeLanguageModalProps = {
  onClose: (open: boolean) => void;
  showModal: boolean;
};

export const ChangeLanguageModal = ({ onClose, showModal }: ChangeLanguageModalProps) => {
  const { t } = useTranslation('profile');

  const handleBack = () => {
    onClose(false);
  };

  const handleChangeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    handleBack();
  };

  return (
    <>
      {showModal && <View style={GLOBAL_STYLES.modalBackground} />}
      <Modal animationType='slide' transparent={true} visible={showModal} onRequestClose={handleBack}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{t('settings.change_language.title')}</Text>
          <Pressable style={styles.languageItem} onPress={() => handleChangeLanguage('vi')}>
            <View style={styles.labelContainer}>
              <View style={{ height: 24, width: 24, overflow: 'hidden', borderRadius: 9999 }}>
                <ViFlag height='100%' width='100%' />
              </View>
              <Text style={styles.text}>{t('settings.change_language.vi')}</Text>
            </View>
            {i18n.language === 'vi' && <Check color={GlobalStyles.color.green[500].color} />}
          </Pressable>
          <Pressable style={styles.languageItem} onPress={() => handleChangeLanguage('en')}>
            <View style={styles.labelContainer}>
              <View style={{ height: 24, width: 24, overflow: 'hidden', borderRadius: 9999 }}>
                <EnFlag height='100%' width='100%' />
              </View>
              <Text style={styles.text}>{t('settings.change_language.en')}</Text>
            </View>

            {i18n.language === 'en' && <Check color={GlobalStyles.color.green[500].color} />}
          </Pressable>

          <Pressable style={styles.closeButton} onPress={handleBack}>
            <X color='gray' />
          </Pressable>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: 16,
    padding: 16,
    paddingBottom: 48,
    ...Styles.backgroundColor.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    ...Styles.borderColor.border,
  },
  text: {
    ...Styles.font.semibold,
    ...Styles.fontSize.callout,
  },
  title: {
    ...Styles.font.semibold,
    ...Styles.fontSize['title-3'],
    textAlign: 'center',
    marginBottom: 16,
  },
});
