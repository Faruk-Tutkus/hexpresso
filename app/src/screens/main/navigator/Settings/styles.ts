import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
  },
  sublabel: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  deleteContainer: {
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    padding: 2,
  },
  switchTrack: {
    width: 52,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  notificationCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  notificationInfo: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    padding: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  loadingIndicator: {
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
})
