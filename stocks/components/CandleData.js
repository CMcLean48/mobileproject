import React from 'react';
import { StyleSheet, SafeAreaView, Text, View, Dimensions } from 'react-native';

const CandleData = ({ lineData, chartConfig, labels }) => {
	return (
		<View style={styles.background}>
			<LineChart
				style={styles.lineChart}
				data={lineData}
				labels={labels}
				//	width={Dimensions.get('window').width} // from react-native
				//	height={220}
				yAxisLabel={'$'}
				chartConfig={chartConfig}
				bezier
				style={styles.bezier}
			/>
		</View>
	);
};
const styles = StyleSheet.create({
	background: {},
	lineChart: {
		height: 220,
		width: Dimensions.get('window').width
	},
	bezier: {
		marginVertical: 8,
		borderRadius: 16
	}
});
export default CandleData;
