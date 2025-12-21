// Top Indian Cities with state mapping and coordinates
export interface IndianCity {
    name: string;
    state: string;
    stateCode: string;
    district: string;
    pincode: string;  // Common PIN prefix
    tier: 1 | 2 | 3;
    lat: number;
    lng: number;
}

export const INDIAN_CITIES: IndianCity[] = [
    // Tier 1 - Metro Cities
    { name: 'Mumbai', state: 'Maharashtra', stateCode: 'MH', district: 'Mumbai', pincode: '400001', tier: 1, lat: 19.076, lng: 72.8777 },
    { name: 'Delhi', state: 'Delhi', stateCode: 'DL', district: 'Central Delhi', pincode: '110001', tier: 1, lat: 28.6139, lng: 77.209 },
    { name: 'Bengaluru', state: 'Karnataka', stateCode: 'KA', district: 'Bengaluru Urban', pincode: '560001', tier: 1, lat: 12.9716, lng: 77.5946 },
    { name: 'Hyderabad', state: 'Telangana', stateCode: 'TG', district: 'Hyderabad', pincode: '500001', tier: 1, lat: 17.385, lng: 78.4867 },
    { name: 'Chennai', state: 'Tamil Nadu', stateCode: 'TN', district: 'Chennai', pincode: '600001', tier: 1, lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', state: 'West Bengal', stateCode: 'WB', district: 'Kolkata', pincode: '700001', tier: 1, lat: 22.5726, lng: 88.3639 },
    { name: 'Ahmedabad', state: 'Gujarat', stateCode: 'GJ', district: 'Ahmedabad', pincode: '380001', tier: 1, lat: 23.0225, lng: 72.5714 },
    { name: 'Pune', state: 'Maharashtra', stateCode: 'MH', district: 'Pune', pincode: '411001', tier: 1, lat: 18.5204, lng: 73.8567 },

    // Tier 2 - Major Cities
    { name: 'Jaipur', state: 'Rajasthan', stateCode: 'RJ', district: 'Jaipur', pincode: '302001', tier: 2, lat: 26.9124, lng: 75.7873 },
    { name: 'Lucknow', state: 'Uttar Pradesh', stateCode: 'UP', district: 'Lucknow', pincode: '226001', tier: 2, lat: 26.8467, lng: 80.9462 },
    { name: 'Surat', state: 'Gujarat', stateCode: 'GJ', district: 'Surat', pincode: '395001', tier: 2, lat: 21.1702, lng: 72.8311 },
    { name: 'Kanpur', state: 'Uttar Pradesh', stateCode: 'UP', district: 'Kanpur Nagar', pincode: '208001', tier: 2, lat: 26.4499, lng: 80.3319 },
    { name: 'Nagpur', state: 'Maharashtra', stateCode: 'MH', district: 'Nagpur', pincode: '440001', tier: 2, lat: 21.1458, lng: 79.0882 },
    { name: 'Indore', state: 'Madhya Pradesh', stateCode: 'MP', district: 'Indore', pincode: '452001', tier: 2, lat: 22.7196, lng: 75.8577 },
    { name: 'Thane', state: 'Maharashtra', stateCode: 'MH', district: 'Thane', pincode: '400601', tier: 2, lat: 19.2183, lng: 72.9781 },
    { name: 'Bhopal', state: 'Madhya Pradesh', stateCode: 'MP', district: 'Bhopal', pincode: '462001', tier: 2, lat: 23.2599, lng: 77.4126 },
    { name: 'Visakhapatnam', state: 'Andhra Pradesh', stateCode: 'AP', district: 'Visakhapatnam', pincode: '530001', tier: 2, lat: 17.6868, lng: 83.2185 },
    { name: 'Patna', state: 'Bihar', stateCode: 'BR', district: 'Patna', pincode: '800001', tier: 2, lat: 25.5941, lng: 85.1376 },
    { name: 'Vadodara', state: 'Gujarat', stateCode: 'GJ', district: 'Vadodara', pincode: '390001', tier: 2, lat: 22.3072, lng: 73.1812 },
    { name: 'Ghaziabad', state: 'Uttar Pradesh', stateCode: 'UP', district: 'Ghaziabad', pincode: '201001', tier: 2, lat: 28.6692, lng: 77.4538 },
    { name: 'Ludhiana', state: 'Punjab', stateCode: 'PB', district: 'Ludhiana', pincode: '141001', tier: 2, lat: 30.901, lng: 75.8573 },
    { name: 'Coimbatore', state: 'Tamil Nadu', stateCode: 'TN', district: 'Coimbatore', pincode: '641001', tier: 2, lat: 11.0168, lng: 76.9558 },
    { name: 'Agra', state: 'Uttar Pradesh', stateCode: 'UP', district: 'Agra', pincode: '282001', tier: 2, lat: 27.1767, lng: 78.0081 },
    { name: 'Madurai', state: 'Tamil Nadu', stateCode: 'TN', district: 'Madurai', pincode: '625001', tier: 2, lat: 9.9252, lng: 78.1198 },
    { name: 'Nashik', state: 'Maharashtra', stateCode: 'MH', district: 'Nashik', pincode: '422001', tier: 2, lat: 19.9975, lng: 73.7898 },
    { name: 'Faridabad', state: 'Haryana', stateCode: 'HR', district: 'Faridabad', pincode: '121001', tier: 2, lat: 28.4089, lng: 77.3178 },
    { name: 'Meerut', state: 'Uttar Pradesh', stateCode: 'UP', district: 'Meerut', pincode: '250001', tier: 2, lat: 28.9845, lng: 77.7064 },
    { name: 'Rajkot', state: 'Gujarat', stateCode: 'GJ', district: 'Rajkot', pincode: '360001', tier: 2, lat: 22.3039, lng: 70.8022 },
    { name: 'Varanasi', state: 'Uttar Pradesh', stateCode: 'UP', district: 'Varanasi', pincode: '221001', tier: 2, lat: 25.3176, lng: 82.9739 },
    { name: 'Srinagar', state: 'Jammu and Kashmir', stateCode: 'JK', district: 'Srinagar', pincode: '190001', tier: 2, lat: 34.0837, lng: 74.7973 },
    { name: 'Aurangabad', state: 'Maharashtra', stateCode: 'MH', district: 'Aurangabad', pincode: '431001', tier: 2, lat: 19.8762, lng: 75.3433 },
    { name: 'Dhanbad', state: 'Jharkhand', stateCode: 'JH', district: 'Dhanbad', pincode: '826001', tier: 2, lat: 23.7957, lng: 86.4304 },
    { name: 'Amritsar', state: 'Punjab', stateCode: 'PB', district: 'Amritsar', pincode: '143001', tier: 2, lat: 31.634, lng: 74.8723 },
    { name: 'Navi Mumbai', state: 'Maharashtra', stateCode: 'MH', district: 'Thane', pincode: '400701', tier: 2, lat: 19.033, lng: 73.0297 },
    { name: 'Allahabad', state: 'Uttar Pradesh', stateCode: 'UP', district: 'Prayagraj', pincode: '211001', tier: 2, lat: 25.4358, lng: 81.8463 },
    { name: 'Ranchi', state: 'Jharkhand', stateCode: 'JH', district: 'Ranchi', pincode: '834001', tier: 2, lat: 23.3441, lng: 85.3096 },
    { name: 'Howrah', state: 'West Bengal', stateCode: 'WB', district: 'Howrah', pincode: '711101', tier: 2, lat: 22.5958, lng: 88.2636 },
    { name: 'Jabalpur', state: 'Madhya Pradesh', stateCode: 'MP', district: 'Jabalpur', pincode: '482001', tier: 2, lat: 23.1815, lng: 79.9864 },
    { name: 'Gwalior', state: 'Madhya Pradesh', stateCode: 'MP', district: 'Gwalior', pincode: '474001', tier: 2, lat: 26.2183, lng: 78.1828 },
    { name: 'Vijayawada', state: 'Andhra Pradesh', stateCode: 'AP', district: 'Krishna', pincode: '520001', tier: 2, lat: 16.5062, lng: 80.648 },
    { name: 'Jodhpur', state: 'Rajasthan', stateCode: 'RJ', district: 'Jodhpur', pincode: '342001', tier: 2, lat: 26.2389, lng: 73.0243 },
    { name: 'Raipur', state: 'Chhattisgarh', stateCode: 'CT', district: 'Raipur', pincode: '492001', tier: 2, lat: 21.2514, lng: 81.6296 },
    { name: 'Kota', state: 'Rajasthan', stateCode: 'RJ', district: 'Kota', pincode: '324001', tier: 2, lat: 25.2138, lng: 75.8648 },
    { name: 'Guwahati', state: 'Assam', stateCode: 'AS', district: 'Kamrup Metropolitan', pincode: '781001', tier: 2, lat: 26.1445, lng: 91.7362 },
    { name: 'Chandigarh', state: 'Chandigarh', stateCode: 'CH', district: 'Chandigarh', pincode: '160001', tier: 2, lat: 30.7333, lng: 76.7794 },
    { name: 'Thiruvananthapuram', state: 'Kerala', stateCode: 'KL', district: 'Thiruvananthapuram', pincode: '695001', tier: 2, lat: 8.5241, lng: 76.9366 },
    { name: 'Kochi', state: 'Kerala', stateCode: 'KL', district: 'Ernakulam', pincode: '682001', tier: 2, lat: 9.9312, lng: 76.2673 },
    { name: 'Solapur', state: 'Maharashtra', stateCode: 'MH', district: 'Solapur', pincode: '413001', tier: 2, lat: 17.6599, lng: 75.9064 },
    { name: 'Hubli-Dharwad', state: 'Karnataka', stateCode: 'KA', district: 'Dharwad', pincode: '580001', tier: 2, lat: 15.3647, lng: 75.124 },
    { name: 'Tiruchirappalli', state: 'Tamil Nadu', stateCode: 'TN', district: 'Tiruchirappalli', pincode: '620001', tier: 2, lat: 10.7905, lng: 78.7047 },
    { name: 'Bareilly', state: 'Uttar Pradesh', stateCode: 'UP', district: 'Bareilly', pincode: '243001', tier: 2, lat: 28.367, lng: 79.4304 },
    { name: 'Mysore', state: 'Karnataka', stateCode: 'KA', district: 'Mysuru', pincode: '570001', tier: 2, lat: 12.2958, lng: 76.6394 },
    { name: 'Gurugram', state: 'Haryana', stateCode: 'HR', district: 'Gurugram', pincode: '122001', tier: 2, lat: 28.4595, lng: 77.0266 },
    { name: 'Noida', state: 'Uttar Pradesh', stateCode: 'UP', district: 'Gautam Buddha Nagar', pincode: '201301', tier: 2, lat: 28.5355, lng: 77.391 },

    // Tier 3 - Emerging Cities
    { name: 'Aligarh', state: 'Uttar Pradesh', stateCode: 'UP', district: 'Aligarh', pincode: '202001', tier: 3, lat: 27.8974, lng: 78.088 },
    { name: 'Warangal', state: 'Telangana', stateCode: 'TG', district: 'Warangal', pincode: '506001', tier: 3, lat: 17.9784, lng: 79.6 },
    { name: 'Guntur', state: 'Andhra Pradesh', stateCode: 'AP', district: 'Guntur', pincode: '522001', tier: 3, lat: 16.3067, lng: 80.4365 },
    { name: 'Bhiwandi', state: 'Maharashtra', stateCode: 'MH', district: 'Thane', pincode: '421302', tier: 3, lat: 19.2967, lng: 73.0631 },
    { name: 'Saharanpur', state: 'Uttar Pradesh', stateCode: 'UP', district: 'Saharanpur', pincode: '247001', tier: 3, lat: 29.9644, lng: 77.5457 },
    { name: 'Gorakhpur', state: 'Uttar Pradesh', stateCode: 'UP', district: 'Gorakhpur', pincode: '273001', tier: 3, lat: 26.7606, lng: 83.3732 },
    { name: 'Bikaner', state: 'Rajasthan', stateCode: 'RJ', district: 'Bikaner', pincode: '334001', tier: 3, lat: 28.0229, lng: 73.3119 },
    { name: 'Amravati', state: 'Maharashtra', stateCode: 'MH', district: 'Amravati', pincode: '444601', tier: 3, lat: 20.932, lng: 77.7523 },
    { name: 'Jamnagar', state: 'Gujarat', stateCode: 'GJ', district: 'Jamnagar', pincode: '361001', tier: 3, lat: 22.4707, lng: 70.0577 },
    { name: 'Bhavnagar', state: 'Gujarat', stateCode: 'GJ', district: 'Bhavnagar', pincode: '364001', tier: 3, lat: 21.7645, lng: 72.1519 },
    { name: 'Ujjain', state: 'Madhya Pradesh', stateCode: 'MP', district: 'Ujjain', pincode: '456001', tier: 3, lat: 23.1765, lng: 75.7885 },
    { name: 'Siliguri', state: 'West Bengal', stateCode: 'WB', district: 'Darjeeling', pincode: '734001', tier: 3, lat: 26.7271, lng: 88.3953 },
    { name: 'Jhansi', state: 'Uttar Pradesh', stateCode: 'UP', district: 'Jhansi', pincode: '284001', tier: 3, lat: 25.4484, lng: 78.5685 },
    { name: 'Ulhasnagar', state: 'Maharashtra', stateCode: 'MH', district: 'Thane', pincode: '421001', tier: 3, lat: 19.2215, lng: 73.1645 },
    { name: 'Jamshedpur', state: 'Jharkhand', stateCode: 'JH', district: 'East Singhbhum', pincode: '831001', tier: 3, lat: 22.8046, lng: 86.2029 },
    { name: 'Jammu', state: 'Jammu and Kashmir', stateCode: 'JK', district: 'Jammu', pincode: '180001', tier: 3, lat: 32.7266, lng: 74.857 },
    { name: 'Mangalore', state: 'Karnataka', stateCode: 'KA', district: 'Dakshina Kannada', pincode: '575001', tier: 3, lat: 12.9141, lng: 74.856 },
    { name: 'Erode', state: 'Tamil Nadu', stateCode: 'TN', district: 'Erode', pincode: '638001', tier: 3, lat: 11.341, lng: 77.7172 },
    { name: 'Belgaum', state: 'Karnataka', stateCode: 'KA', district: 'Belgaum', pincode: '590001', tier: 3, lat: 15.8497, lng: 74.4977 },
    { name: 'Tiruppur', state: 'Tamil Nadu', stateCode: 'TN', district: 'Tiruppur', pincode: '641601', tier: 3, lat: 11.1085, lng: 77.3411 },
    { name: 'Bhubaneswar', state: 'Odisha', stateCode: 'OR', district: 'Khordha', pincode: '751001', tier: 3, lat: 20.2961, lng: 85.8245 },
    { name: 'Salem', state: 'Tamil Nadu', stateCode: 'TN', district: 'Salem', pincode: '636001', tier: 3, lat: 11.6643, lng: 78.146 },
    { name: 'Davanagere', state: 'Karnataka', stateCode: 'KA', district: 'Davanagere', pincode: '577001', tier: 3, lat: 14.4644, lng: 75.9218 },
    { name: 'Bellary', state: 'Karnataka', stateCode: 'KA', district: 'Ballari', pincode: '583101', tier: 3, lat: 15.1394, lng: 76.9214 },
    { name: 'Nellore', state: 'Andhra Pradesh', stateCode: 'AP', district: 'Nellore', pincode: '524001', tier: 3, lat: 14.4426, lng: 79.9865 },
    { name: 'Kolhapur', state: 'Maharashtra', stateCode: 'MH', district: 'Kolhapur', pincode: '416001', tier: 3, lat: 16.705, lng: 74.2433 },
    { name: 'Ajmer', state: 'Rajasthan', stateCode: 'RJ', district: 'Ajmer', pincode: '305001', tier: 3, lat: 26.4499, lng: 74.6399 },
    { name: 'Gulbarga', state: 'Karnataka', stateCode: 'KA', district: 'Kalaburagi', pincode: '585101', tier: 3, lat: 17.3297, lng: 76.8343 },
    { name: 'Udaipur', state: 'Rajasthan', stateCode: 'RJ', district: 'Udaipur', pincode: '313001', tier: 3, lat: 24.5854, lng: 73.7125 },
    { name: 'Malegaon', state: 'Maharashtra', stateCode: 'MH', district: 'Nashik', pincode: '423203', tier: 3, lat: 20.5579, lng: 74.5089 },
];

export const getCitiesByState = (stateCode: string): IndianCity[] =>
    INDIAN_CITIES.filter(c => c.stateCode === stateCode);

export const getCitiesByTier = (tier: 1 | 2 | 3): IndianCity[] =>
    INDIAN_CITIES.filter(c => c.tier === tier);

export const getMetroCities = (): IndianCity[] => getCitiesByTier(1);

export const getCityByName = (name: string): IndianCity | undefined =>
    INDIAN_CITIES.find(c => c.name.toLowerCase() === name.toLowerCase());
