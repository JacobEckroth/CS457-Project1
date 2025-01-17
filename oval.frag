#version 330 compatibility
uniform float uAd;
uniform float uBd;
uniform float uTol;

uniform float uKa, uKd, uKs;
uniform float uShininess;

in vec3 vMCposition;

in vec2 vST;
in vec3 vColor;
in vec3 vN; // normal vector
in vec3 vL; // vector from point to light
in vec3 vE; // vector from point to eye
#define SQUARE(a) a*a

const vec3 dotColor = vec3(1.,.8,.3);
const vec3 specularColor = vec3(1.,1.,1.);
void
main( )
{



    float Ar = uAd / 2.;
    float Br = uBd / 2.;
    int numins = int ( vST.s / uAd);
    int numint = int (vST.t / uBd);

  
    float sCenter = numins * uAd + Ar;
    float tCenter = numint * uBd + Br;
    
    float inOvalOrNot = (  SQUARE((vST.s - sCenter)/Ar) + SQUARE((vST.t - tCenter)/Br));
    float t = smoothstep(1.-uTol, 1.+uTol, inOvalOrNot);
    
    vec3 finalColor = mix(vColor,dotColor,t);


    vec3 Normal = normalize(vN);
    vec3 Light = normalize(vL);
    vec3 Eye = normalize(vE);
    vec3 ambient = uKa * finalColor;
    float d = max( dot(Normal,Light), 0. ); // only do diffuse if the light can see the point
    vec3 diffuse = uKd * d * finalColor;
    float s = 0.;
    if( dot(Normal,Light) > 0. ) // only do specular if the light can see the point
    {
        vec3 ref = normalize( reflect( -Light, Normal ) );
        s = pow( max( dot(Eye,ref),0. ), uShininess );
    }
    vec3 specular = uKs * s * specularColor;



 

    gl_FragColor = vec4( ambient + specular + diffuse, 1. );
}