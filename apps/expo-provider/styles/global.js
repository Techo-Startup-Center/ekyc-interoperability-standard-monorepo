import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

const globalStyle = StyleSheet.create({
    background: {
        backgroundColor: COLORS.background,
        width: '100%',
        height: '100%'
    },
    container: {
        width: "100%",
    },
    titleLg: {
        fontSize: 22,
        fontFamily: 'PPMedium',
        color: 'white',
        letterSpacing: 1
    },
    titleSm: {
        fontSize: 14,
        fontFamily: 'PPMedium',
        color: 'white',
        letterSpacing: 1
    },
    titleMedium: {
        fontSize: 18,
        fontFamily: 'PPMedium',
        color: 'white',
        letterSpacing: 1
    },
    primaryColor: {
        color: COLORS.primary
    },
    secondaryColor: {
        color: COLORS.secondary
    },
    paddingHorizontal: {
        paddingLeft: 15,
        paddingRight: 15
    },
    headerPadding: {
        paddingTop: 110
    },
    paddingTop: {
        marginTop: 20
    },
    paddingHeader: {
        marginTop: 40,
    },
    verticalSpacing: {
        marginTop: '1%',
    },
    smallImg: {
        width: 40,
        height: 40,
    },
    headerHeight: {
        justifyContent: 'center',
        height: 60,
        paddingLeft: 10,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    centerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    pressableWhite: {
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    fontSemiBold: {
        fontFamily: 'PPSemiBold'
    },
    certTitle: {
        fontSize: 18,
        fontFamily: 'PPSemiBold',
        color: 'white',
        letterSpacing: 1
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
})

export default globalStyle;